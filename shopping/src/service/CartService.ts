import ICartRepository from "../interfaces/ICartRepository.js";
import Cart from "../models/Cart.js";
import { CartItem } from "../models/CartItem.js";
import CarItemAlreadyExistsError from "../models/errors/CartItemAlreadyExistsError.js";
import CartItemNotFoundError from "../models/errors/CartItemNotFoundError.js";
import CartNotFoundError from "../models/errors/CartNotFoundError.js";

class CartService {
  private cart_repository: ICartRepository;

  constructor(cart_repository: ICartRepository) {
    this.cart_repository = cart_repository;
  }

  /**
   * Get a user's cart
   * @param user_id User ID
   * @returns A promise to the Cart object or a CarNotFoundError
   */
  public async getCart(user_id: string): Promise<Cart | CartNotFoundError> {
    return await this.cart_repository.getCartByUserId(user_id);
  }

  /**
   * Get an item from user's cart
   * @param user_id User ID
   * @param product_id Product ID
   * @returns A promise to the CartItem object or a CarItemNotFoundError
   */
  public async getCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItem | CartItemNotFoundError> {
    return await this.cart_repository.getCartItem(user_id, product_id);
  }

  /**
   * Add an item to user's cart
   * @param user_id User ID
   * @param cart_item CartItem object
   * @return A promise to the Cart object or a CarItemAlreadyExistsError
   */
  public async addItemToCart(
    user_id: string,
    cart_item: CartItem
  ): Promise<Cart | CarItemAlreadyExistsError> {
    return await this.cart_repository.addCartItem(user_id, cart_item);
  }

  /**
   * Remove an item from user's cart
   * @param user_id User ID
   * @param product_id Product ID
   * @returns Promise to null if successfull or CartItemNotFoundError
   */
  public async removeItemFromCart(
    user_id: string,
    product_id: string
  ): Promise<CartItemNotFoundError | null> {
    return await this.cart_repository.removeCartItem(user_id, product_id);
  }

  /**
   * Update an item from user's cart
   * @param user_id User ID
   * @param cart_item CartItem object
   * @returns Promise to Cart or CartItemNotFoundError
   */
  public async updateItemFromCart(
    user_id: string,
    cart_item: CartItem
  ): Promise<Cart | CartItemNotFoundError> {
    return await this.cart_repository.updateCartItem(user_id, cart_item);
  }

  /**
   * Delete a user's cart
   * @param user_id User ID
   * @returns Promise to null if successfull or CartNotFoundError
   */
  public async deleteCart(user_id: string): Promise<CartNotFoundError | null> {
    return await this.cart_repository.deleteCart(user_id);
  }
}

export default CartService;
