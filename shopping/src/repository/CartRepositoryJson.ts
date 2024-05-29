import ICartRepository from "../interfaces/ICartRepository.js";
import dotenv from "dotenv";
import fs from "fs";
import { CartItem } from "../models/CartItem.js";
import CartItemNotFoundError from "../models/errors/CartItemNotFoundError.js";
import CartItemAlreadyExistsError from "../models/errors/CartItemAlreadyExistsError.js";
import Cart from "../models/Cart.js";
import CartNotFoundError from "../models/errors/CartNotFoundError.js";
import CartAlreadyExistsError from "../models/errors/CartAlreadyExistsError.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

class CartRepositoryJson implements ICartRepository {
  private filename: string;

  constructor() {
    this.filename = process.env.MOCK_DATA_FILENAME || "cart.json";
  }

  // ========================== Private Internal Methods ==========================

  private async getAllCarts(): Promise<Cart[]> {
    if (fs.existsSync(this.filename)) {
      const filecontent = await fs.promises.readFile(this.filename, "utf8");
      const data: Cart[] = JSON.parse(filecontent);
      return data;
    } else {
      return [];
    }
  }

  private async updateCart(cart: Cart): Promise<void> {
    const carts = await this.getAllCarts();
    const updated_carts = carts.map((existing) => {
      if (existing.user_id === cart.user_id) {
        return cart;
      } else {
        return existing;
      }
    });
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(updated_carts, null, 2)
    );
  }

  // ========================= Public Override Methods ===============================

  public async getCartByUserId(
    user_id: string
  ): Promise<Cart | CartNotFoundError> {
    const carts = await this.getAllCarts();
    const found_cart = carts.find((cart) => cart.user_id === user_id);
    if (found_cart) {
      return new Cart(found_cart.id, found_cart.user_id, found_cart.items);
    }
    return new CartNotFoundError(user_id);
  }

  public async createCart(cart: Cart): Promise<Cart | CartAlreadyExistsError> {
    const carts = await this.getAllCarts();
    const match = carts.find((_cart) => _cart.user_id === cart.user_id);
    if (!match) {
      carts.push(cart);
      await fs.promises.writeFile(
        this.filename,
        JSON.stringify(carts, null, 2)
      );
      return cart;
    }
    return new CartAlreadyExistsError(cart.user_id);
  }

  public async getCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItem | CartItemNotFoundError> {
    const cart = await this.getCartByUserId(user_id);
    if (cart instanceof Cart) {
      const { items } = cart;
      const found_item = items.find((item) => item.product_id === product_id);
      if (found_item) {
        return new CartItem(found_item.product_id, found_item.amount);
      }
      return new CartItemNotFoundError(product_id);
    }
    return new CartItemNotFoundError(product_id);
  }

  public async addCartItem(
    user_id: string,
    item: CartItem
  ): Promise<Cart | CartItemAlreadyExistsError> {
    const cart = await this.getCartByUserId(user_id);
    if (cart instanceof Cart) {
      const match = cart.items.find(
        (cart_item) => cart_item.product_id === item.product_id
      );
      if (!match) {
        cart.addItem(item);
        await this.updateCart(cart);
        return cart;
      }
      return new CartItemAlreadyExistsError(item.product_id);
    } else if (cart instanceof CartNotFoundError) {
      const uid = uuidv4();
      const items: CartItem[] = [item];
      const new_cart = new Cart(uid, user_id, items);
      await this.createCart(new_cart);
      return new_cart;
    }
    return new CartItemAlreadyExistsError(item.product_id);
  }

  public async removeCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItemNotFoundError | null> {
    const cart = await this.getCartByUserId(user_id);
    if (cart instanceof CartNotFoundError) {
      return new CartItemNotFoundError(product_id);
    }
    const item = await this.getCartItem(user_id, product_id);
    if (item instanceof CartItemNotFoundError) {
      return new CartItemNotFoundError(product_id);
    }
    cart.items = cart.items.filter(
      (_item) => _item.product_id !== item.product_id
    );
    await this.updateCart(cart);
    return null;
  }

  public async updateCartItem(
    user_id: string,
    item: CartItem
  ): Promise<Cart | CartItemNotFoundError> {
    const cart = await this.getCartByUserId(user_id);
    if (cart instanceof CartNotFoundError) {
      return new CartItemNotFoundError(item.product_id);
    }
    const found_item = await this.getCartItem(user_id, item.product_id);
    if (found_item instanceof CartItemNotFoundError) {
      return new CartItemNotFoundError(item.product_id);
    }
    cart.items = cart.items.map((_item) => {
      if (_item.product_id === item.product_id) {
        return item;
      }
      return _item;
    });
    await this.updateCart(cart);
    return cart;
  }
}

export default CartRepositoryJson;
