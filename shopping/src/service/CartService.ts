import ICartRepository from "../interfaces/ICartRepository.js";
import ICartService from "../interfaces/ICartService.js";
import Cart from "../models/Cart.js";
import { CartItem } from "../models/CartItem.js";
import CarItemAlreadyExistsError from "../models/errors/CartItemAlreadyExistsError.js";
import CartItemNotFoundError from "../models/errors/CartItemNotFoundError.js";
import CartNotFoundError from "../models/errors/CartNotFoundError.js";

class CartService implements ICartService {
  constructor(private cart_repository: ICartRepository) {
    this.cart_repository = cart_repository;
  }

  public async getCart(user_id: string): Promise<Cart | CartNotFoundError> {
    return await this.cart_repository.getCartByUserId(user_id);
  }

  public async getCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItem | CartItemNotFoundError> {
    return await this.cart_repository.getCartItem(user_id, product_id);
  }

  public async addItemToCart(
    user_id: string,
    cart_item: CartItem
  ): Promise<Cart | CarItemAlreadyExistsError> {
    return await this.cart_repository.addCartItem(user_id, cart_item);
  }

  public async removeItemFromCart(
    user_id: string,
    product_id: string
  ): Promise<CartItemNotFoundError | null> {
    return await this.cart_repository.removeCartItem(user_id, product_id);
  }

  public async updateItemFromCart(
    user_id: string,
    cart_item: CartItem
  ): Promise<Cart | CartItemNotFoundError> {
    return await this.cart_repository.updateCartItem(user_id, cart_item);
  }

  public async deleteCart(user_id: string): Promise<CartNotFoundError | null> {
    return await this.cart_repository.deleteCart(user_id);
  }
}

export default CartService;
