import { NextFunction, Request, Response } from "express";
import { cart_item_schema } from "../schemas/CartItemSchemas.js";

class ValidateMiddleware {
  static validateCartItem(req: Request, res: Response, next: NextFunction) {
    const { error, value } = cart_item_schema.validate(req.body);
    if (error) {
      let details = error.details[0];
      return res
        .status(400)
        .json({ error: details.type, message: details.message });
    }
    req.body = value;
    next();
  }
}

export default ValidateMiddleware;
