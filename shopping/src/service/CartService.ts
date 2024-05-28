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
   * Get a cart
   * @param user_id User ID
   * @returns A promise to the Cart object or a CarNotFoundError
   */
  public async getCart(user_id: string): Promise<Cart | CartNotFoundError> {
    return await this.cart_repository.getCartByUserId(user_id);
  }

  /**
   * Get an item from cart
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
   * Add an item to cart
   * @param user_id User ID
   * @param cart_item CartItem object
   * @return A promise to the CartItem object or a CarItemAlreadyExistsError
   */
  public async addItemToCart(
    user_id: string,
    cart_item: CartItem
  ): Promise<CartItem | CarItemAlreadyExistsError> {
    return await this.cart_repository.addCartItem(user_id, cart_item);
  }
}

export default CartService;
