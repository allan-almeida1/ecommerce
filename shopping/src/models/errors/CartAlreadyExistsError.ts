class CartAlreadyExistsError extends Error {
  public http_json: Object;

  constructor(user_id: string) {
    super(`Cart from user_id ${user_id} already exists`);
    this.name = "CartAlreadyExists";

    this.http_json = {
      error: this.name,
      message: this.message,
    };
  }
}

export default CartAlreadyExistsError;
