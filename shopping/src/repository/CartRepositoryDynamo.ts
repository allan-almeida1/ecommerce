import {
  ConditionalCheckFailedException,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import ICartRepository from "../interfaces/ICartRepository.js";
import Cart from "../models/Cart.js";
import CartNotFoundError from "../models/errors/CartNotFoundError.js";
import { CartItem } from "../models/CartItem.js";
import CartAlreadyExistsError from "../models/errors/CartAlreadyExistsError.js";
import CartItemNotFoundError from "../models/errors/CartItemNotFoundError.js";
import CartItemAlreadyExistsError from "../models/errors/CartItemAlreadyExistsError.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const REGION = process.env.AWS_REGION || "us-east-1";
const ENDPOINT = process.env.AWS_ENDPOINT || "http://localhost:4566";
const TABLE_NAME = process.env.TABLE_NAME || "cart_table";

class CartRepositoryDynamoDB implements ICartRepository {
  private db: DynamoDBClient;

  constructor() {
    this.db = new DynamoDBClient({
      region: REGION,
      endpoint: ENDPOINT,
    });
  }

  private dynamoData2Cart(data: GetItemCommandOutput): Cart {
    const id = data.Item!.id.S!;
    const user_id = data.Item!.user_id.S!;
    const cart_items = data.Item!.items.L!.map((item) => {
      const product_id = item.M!.product_id.S!;
      const amount = parseInt(item.M!.amount.N!);
      return new CartItem(product_id, amount);
    });
    return new Cart(id, user_id, cart_items);
  }

  public async getCartByUserId(
    user_id: string
  ): Promise<Cart | CartNotFoundError> {
    const params: GetItemCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        user_id: {
          S: user_id,
        },
      },
    };

    try {
      const cmd = new GetItemCommand(params);
      const data = await this.db.send(cmd);
      if (data.Item) {
        return this.dynamoData2Cart(data);
      }
      return new CartNotFoundError(user_id);
    } catch (err) {
      console.log(err);
      return new CartNotFoundError(user_id);
    }
  }

  public async createCart(cart: Cart): Promise<Cart | CartAlreadyExistsError> {
    const params: PutItemCommandInput = {
      TableName: TABLE_NAME,
      Item: {
        user_id: {
          S: cart.user_id,
        },
        id: {
          S: cart.id,
        },
        items: {
          L: cart.items.map((item) => ({
            M: {
              product_id: { S: item.product_id },
              amount: { N: item.amount.toString() },
            },
          })),
        },
      },
      ConditionExpression: "attribute_not_exists(user_id)",
    };

    try {
      const cmd = new PutItemCommand(params);
      await this.db.send(cmd);
      return cart;
    } catch (err) {
      console.log(err);
      return new CartAlreadyExistsError(cart.user_id);
    }
  }

  public async deleteCart(user_id: string): Promise<CartNotFoundError | null> {
    const params: DeleteItemCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        user_id: {
          S: user_id,
        },
      },
      ConditionExpression: "attribute_exists(user_id)",
    };

    try {
      const cmd = new DeleteItemCommand(params);
      await this.db.send(cmd);
      return null;
    } catch (err) {
      console.log(err);
      return new CartNotFoundError(user_id);
    }
  }

  public async getCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItem | CartItemNotFoundError> {
    const params: GetItemCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        user_id: {
          S: user_id,
        },
      },
    };

    try {
      const cmd = new GetItemCommand(params);
      const data = await this.db.send(cmd);
      if (data.Item) {
        const cart = this.dynamoData2Cart(data);
        const item = cart.items.find(
          (_item) => _item.product_id === product_id
        );
        if (!item) {
          return new CartItemNotFoundError(product_id);
        }
        return item;
      }
      return new CartItemNotFoundError(product_id);
    } catch (err) {
      console.log(err);
      return new CartItemNotFoundError(product_id);
    }
  }

  public async addCartItem(
    user_id: string,
    item: CartItem
  ): Promise<Cart | CartItemAlreadyExistsError> {
    const cart = await this.getCartByUserId(user_id);
    if (cart instanceof CartNotFoundError) {
      const id = uuidv4();
      const new_cart = new Cart(id, user_id, [item]);
      return await this.createCart(new_cart);
    }
    const items = cart.items;
    const item_exists = items.some((i) => {
      return i.product_id === item.product_id;
    });
    if (item_exists) {
      return new CartItemAlreadyExistsError(item.product_id);
    }

    const params: UpdateItemCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        user_id: {
          S: user_id,
        },
      },
      UpdateExpression:
        "SET #items = list_append(if_not_exists(#items, :emptyList), :newCartItem)",
      ExpressionAttributeNames: {
        "#items": "items",
      },
      ExpressionAttributeValues: {
        ":newCartItem": {
          L: [
            {
              M: {
                product_id: { S: item.product_id },
                amount: { N: item.amount.toString() },
              },
            },
          ],
        },
        ":emptyList": {
          L: [],
        },
      },
      ConditionExpression: "attribute_exists(user_id)",
      ReturnValues: "ALL_NEW",
    };

    try {
      const cmd = new UpdateItemCommand(params);
      const data = await this.db.send(cmd);
      const id = data.Attributes!.id.S!;
      const _user_id = data.Attributes!.user_id.S!;
      const items = data.Attributes!.items.L!.map((i) => {
        const product_id = i.M!.product_id.S!;
        const amount: number = parseInt(i.M!.amount.N!);
        return new CartItem(product_id, amount);
      });
      return new Cart(id, _user_id, items);
    } catch (err) {
      return new CartItemAlreadyExistsError(item.product_id);
    }
  }

  public async removeCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItemNotFoundError | null> {
    const cart = await this.getCartByUserId(user_id);
    if (cart instanceof CartNotFoundError) {
      return new CartItemNotFoundError(product_id);
    }
    const item_exists = cart.items.some((i) => {
      return i.product_id === product_id;
    });
    if (!item_exists) {
      return new CartItemNotFoundError(product_id);
    }
    cart.items = cart.items.filter((i) => {
      return i.product_id !== product_id;
    });
    const params: UpdateItemCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        user_id: {
          S: user_id,
        },
      },
      UpdateExpression: "SET #items = :newItems",
      ExpressionAttributeNames: {
        "#items": "items",
      },
      ExpressionAttributeValues: {
        ":newItems": {
          L: cart.items.map((item) => ({
            M: {
              product_id: {
                S: item.product_id,
              },
              amount: {
                N: item.amount.toString(),
              },
            },
          })),
        },
      },
      ConditionExpression: "attribute_exists(user_id)",
    };

    try {
      const cmd = new UpdateItemCommand(params);
      await this.db.send(cmd);
      return null;
    } catch (err) {
      console.log(err);
      return new CartItemNotFoundError(product_id);
    }
  }

  public async updateCartItem(
    user_id: string,
    item: CartItem
  ): Promise<Cart | CartItemNotFoundError> {
    const cart = await this.getCartByUserId(user_id);
    if (cart instanceof CartNotFoundError) {
      return new CartItemNotFoundError(item.product_id);
    }
    const found_item = cart.items.find((i) => {
      return i.product_id === item.product_id;
    });
    if (!found_item) {
      console.log("Didn't find cart item");
      return new CartItemNotFoundError(item.product_id);
    }
    cart.items = cart.items.map((i) => {
      if (i.product_id === item.product_id) {
        return item;
      }
      return i;
    });

    const params: UpdateItemCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        user_id: {
          S: user_id,
        },
      },
      UpdateExpression: "SET #items = :newItems",
      ExpressionAttributeNames: {
        "#items": "items",
      },
      ExpressionAttributeValues: {
        ":newItems": {
          L: cart.items.map((item) => ({
            M: {
              product_id: {
                S: item.product_id,
              },
              amount: {
                N: item.amount.toString(),
              },
            },
          })),
        },
      },
      ConditionExpression: "attribute_exists(user_id)",
      ReturnValues: "ALL_NEW",
    };

    try {
      const cmd = new UpdateItemCommand(params);
      const data = await this.db.send(cmd);
      const id = data.Attributes!.id.S!;
      const _user_id = data.Attributes!.user_id.S!;
      const items = data.Attributes!.items.L!.map((i) => {
        const product_id = i.M!.product_id.S!;
        const amount: number = parseInt(i.M!.amount.N!);
        return new CartItem(product_id, amount);
      });
      return new Cart(id, _user_id, items);
    } catch (err) {
      console.log(err);
      return new CartItemNotFoundError(item.product_id);
    }
  }
}

export default CartRepositoryDynamoDB;
