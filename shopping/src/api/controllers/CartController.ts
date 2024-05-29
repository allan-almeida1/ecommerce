import { Router, Request, Response } from "express";
import CartService from "../../service/CartService.js";
import CartRepositoryJson from "../../repository/CartRepositoryJson.js";
import { CartItem } from "../../models/CartItem.js";
import CarItemAlreadyExistsError from "../../models/errors/CartItemAlreadyExistsError.js";
import ValidateMiddleware from "../middlewares/ValidateMiddleware.js";
import CartItemNotFoundError from "../../models/errors/CartItemNotFoundError.js";
import Cart from "../../models/Cart.js";
import CartNotFoundError from "../../models/errors/CartNotFoundError.js";
import { Authorization, IRequestWithUser } from "auth-package";

/**
 * Class to control cart operations
 */
class CartController {
  public router: Router;

  private cart_service: CartService;

  constructor() {
    this.router = Router();

    this.router.get("", Authorization.verifyToken, this.getCart.bind(this));
    this.router.delete(
      "",
      Authorization.verifyToken,
      this.deleteCart.bind(this)
    );

    this.router.get(
      "/items/:product_id",
      Authorization.verifyToken,
      this.getItem.bind(this)
    );

    this.router.delete(
      "/items/:product_id",
      Authorization.verifyToken,
      this.removeFromCart.bind(this)
    );

    this.router.put(
      "/items/:product_id",
      Authorization.verifyToken,
      ValidateMiddleware.validateCartItemAmount,
      this.updateItem.bind(this)
    );

    this.router.post(
      "/items",
      Authorization.verifyToken,
      ValidateMiddleware.validateCartItem,
      this.addToCart.bind(this)
    );

    this.cart_service = new CartService(new CartRepositoryJson());
  }

  /**
   * Get a user's cart if exists
   * @param req HTTP Request
   * @param res HTTP Response
   */
  private async getCart(req: Request, res: Response) {
    const user = (req as IRequestWithUser).user;
    const cart = await this.cart_service.getCart(user.sub!);
    if (cart instanceof Cart) {
      res.json(cart);
    } else if (cart instanceof CartNotFoundError) {
      res.status(404).json(cart.http_json);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Get an item from user's cart if it exists
   * @param req HTTP Request with product_id as parameter
   * @param res HTTP Response
   */
  private async getItem(req: Request, res: Response) {
    const { product_id } = req.params;
    const user = (req as IRequestWithUser).user;
    const item = await this.cart_service.getCartItem(user.sub!, product_id);
    if (item instanceof CartItem) {
      res.json(item);
    } else if (item instanceof CartItemNotFoundError) {
      res.status(404).json(item.http_json);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Add an item to user's cart. If user doesn't have a cart, create one
   * and add the item
   * @param req HTTP Request with CartItem on body
   * @param res HTTP Response
   */
  private async addToCart(req: Request, res: Response) {
    const { product_id, amount } = req.body;
    const cart_item = new CartItem(product_id, amount);
    const user = (req as IRequestWithUser).user;
    const added_item = await this.cart_service.addItemToCart(
      user.sub!,
      cart_item
    );
    if (added_item instanceof Cart) {
      res.json(added_item);
    } else if (added_item instanceof CarItemAlreadyExistsError) {
      res.status(409).json(added_item.http_json);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Remove an item from user's cart if it exists
   * @param req HTTP Request with product_id as parameter
   * @param res HTTP Response
   */
  private async removeFromCart(req: Request, res: Response) {
    const { product_id } = req.params;
    const user = (req as IRequestWithUser).user;
    const result = await this.cart_service.removeItemFromCart(
      user.sub!,
      product_id
    );
    if (!result) {
      res.status(204).send();
    } else if (result instanceof CartItemNotFoundError) {
      res.status(404).json(result.http_json);
    }
  }

  /**
   * Update an item from user's cart if it exists
   * @param req HTTP Request with product_id as parameter and amount in body
   * @param res HTTP Response
   */
  private async updateItem(req: Request, res: Response) {
    const { product_id } = req.params;
    const { amount } = req.body;
    const user = (req as IRequestWithUser).user;
    const result = await this.cart_service.updateItemFromCart(
      user.sub!,
      new CartItem(product_id, amount)
    );
    if (result instanceof CartItemNotFoundError) {
      res.status(404).json(result.http_json);
    } else if (result instanceof Cart) {
      res.json(result);
    }
  }

  /**
   * Delete a user's cart
   * @param req HTTP Request
   * @param res HTTP Response
   */
  private async deleteCart(req: Request, res: Response) {
    const user = (req as IRequestWithUser).user;
    const result = await this.cart_service.deleteCart(user.sub!);
    if (!result) {
      res.status(204).send();
    } else if (result instanceof CartNotFoundError)
      [res.status(404).json(result.http_json)];
  }
}

export default CartController;
