class CartItemAlreadyExistsError extends Error {
  public http_json: Object;

  constructor(product_id: string) {
    super(`Item with product_id ${product_id} already exists`);
    this.name = "CartItemAlreadyExists";

    this.http_json = {
      error: this.name,
      message: this.message,
    };
  }
}

export default CartItemAlreadyExistsError;
