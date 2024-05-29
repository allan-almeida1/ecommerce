import Cart from "../models/Cart.js";
import { CartItem } from "../models/CartItem.js";
import CartAlreadyExistsError from "../models/errors/CartAlreadyExistsError.js";
import CarItemAlreadyExistsError from "../models/errors/CartItemAlreadyExistsError.js";
import CartItemNotFoundError from "../models/errors/CartItemNotFoundError.js";
import CartNotFoundError from "../models/errors/CartNotFoundError.js";

interface ICartRepository {
  /**
   * Get user's cart using user ID as key
   * @param user_id User ID
   * @returns Promise of a Cart or CartNotFoundError
   */
  getCartByUserId(user_id: string): Promise<Cart | CartNotFoundError>;

  /**
   * Create a new cart
   * @param cart Cart object to be created
   * @returns Promise of a Cart or CartAlreadyExistsError
   */
  createCart(cart: Cart): Promise<Cart | CartAlreadyExistsError>;

  /**
   * Get an item from user's cart
   * @param user_id User ID
   * @param product_id Product ID
   * @returns Promise of a CartItem or CartItemNotFoundError
   */
  getCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItem | CartItemNotFoundError>;

  /**
   * Add an item to an existing cart or create a new cart
   * and add the item if user has no cart
   * @param user_id User ID
   * @param item CartItem object
   */
  addCartItem(
    user_id: string,
    item: CartItem
  ): Promise<Cart | CarItemAlreadyExistsError>;

  /**
   * Remove an item from user's cart
   * @param user_id User ID
   * @param product_id Product ID
   * @returns Promise of null if successfull or CartItemNotFoundError
   */
  removeCartItem(
    user_id: string,
    product_id: string
  ): Promise<null | CartItemNotFoundError>;

  /**
   * Update an item from user's cart
   * @param user_id User ID
   * @param item CartItemObject
   */
  updateCartItem(
    user_id: string,
    item: CartItem
  ): Promise<Cart | CartItemNotFoundError>;

  //   update(item: CartItem): Promise<CartItem>;
  //   remove(product_id: string): Promise<CartItem>;
  //   getAll(): Promise<CartItem[]>;
  //   removeAll(): Promise<CartItem[]>;
}

export default ICartRepository;
