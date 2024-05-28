/**
 * Class to define a Cart Item
 */
class CartItem {
  public product_id: string; // Product ID
  public amount: number; // Amount in the cart

  constructor(product_id: string, amount: number) {
    this.product_id = product_id;
    this.amount = amount;
  }
}

export { CartItem };
