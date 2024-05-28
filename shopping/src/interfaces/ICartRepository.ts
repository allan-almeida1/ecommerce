import Cart from "../models/Cart.js";
import { CartItem } from "../models/CartItem.js";
import CartAlreadyExistsError from "../models/errors/CartAlreadyExistsError.js";
import CarItemAlreadyExistsError from "../models/errors/CartItemAlreadyExistsError.js";
import CartItemNotFound from "../models/errors/CartItemNotFoundError.js";
import CartNotFoundError from "../models/errors/CartNotFoundError.js";

interface ICartRepository {
  getCartByUserId(user_id: string): Promise<Cart | CartNotFoundError>;
  createCart(cart: Cart): Promise<Cart | CartAlreadyExistsError>;
  getCartItem(
    user_id: string,
    product_id: string
  ): Promise<CartItem | CartItemNotFound>;
  addCartItem(
    user_id: string,
    item: CartItem
  ): Promise<CartItem | CarItemAlreadyExistsError>;

  //   update(item: CartItem): Promise<CartItem>;
  //   remove(product_id: string): Promise<CartItem>;
  //   getAll(): Promise<CartItem[]>;
  //   removeAll(): Promise<CartItem[]>;
}

export default ICartRepository;
