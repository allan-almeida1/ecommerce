import { CartItem } from "./CartItem.js";

/**
 * Class to define a Cart
 */
class Cart {
  public id: string;
  public user_id: string;
  public items: CartItem[];

  constructor(id: string, user_id: string, items?: CartItem[]) {
    this.id = id;
    this.user_id = user_id;
    this.items = items || [];
  }

  public addItem(item: CartItem): void {
    this.items.push(item);
  }
}

export default Cart;
