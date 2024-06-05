import Cart from "../models/Cart.js";
import { CartItem } from "../models/CartItem.js";
import CartItemAlreadyExistsError from "../models/errors/CartItemAlreadyExistsError.js";
import CartItemNotFoundError from "../models/errors/CartItemNotFoundError.js";
import CartNotFoundError from "../models/errors/CartNotFoundError.js";

interface ICartService {
  /**
   * Get a user's cart
   * @param user_id User ID
   * @returns A promise to the Cart object or a CarNotFoundError
   */
  getCart(user_id: string): Promise<Cart | CartNotFoundError>;

  /**
   * Get an item from user's cart
   * @param user_id User ID
   * @param product_id Product ID
   * @returns A promise to the CartItem object or a CarItemNotFoundError
   */
  getCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItem | CartItemNotFoundError>;

  /**
   * Add an item to user's cart
   * @param user_id User ID
   * @param cart_item CartItem object
   * @return A promise to the Cart object or a CarItemAlreadyExistsError
   */
  addItemToCart(
    user_id: string,
    cart_item: CartItem
  ): Promise<Cart | CartItemAlreadyExistsError>;

  /**
   * Remove an item from user's cart
   * @param user_id User ID
   * @param product_id Product ID
   * @returns Promise to null if successfull or CartItemNotFoundError
   */
  removeItemFromCart(
    user_id: string,
    product_id: string
  ): Promise<CartItemNotFoundError | null>;

  /**
   * Update an item from user's cart
   * @param user_id User ID
   * @param cart_item CartItem object
   * @returns Promise to Cart or CartItemNotFoundError
   */
  updateItemFromCart(
    user_id: string,
    cart_item: CartItem
  ): Promise<Cart | CartItemNotFoundError>;

  /**
   * Delete a user's cart
   * @param user_id User ID
   * @returns Promise to null if successfull or CartNotFoundError
   */
  deleteCart(user_id: string): Promise<CartNotFoundError | null>;
}

export default ICartService;
