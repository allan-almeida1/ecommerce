class CartNotFoundError extends Error {
  public http_json: Object;

  constructor(user_id: string) {
    super(`Cart from user_id ${user_id} not found`);
    this.name = "CartNotFound";
    this.http_json = {
      error: this.name,
      message: this.message,
    };
  }
}

export default CartNotFoundError;
