import { NextFunction, Request, Response } from "express";
import {
  cart_item_amount_schema,
  cart_item_schema,
} from "../schemas/CartItemSchemas.js";
import { ValidationError } from "joi";

class ValidateMiddleware {
  private static sendError(error: ValidationError, res: Response): void {
    const details = error.details[0];
    res.status(400).json({ error: details.type, message: details.message });
  }

  public static validateCartItem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { error, value } = cart_item_schema.validate(req.body);
    if (error) {
      return ValidateMiddleware.sendError(error, res);
    }
    req.body = value;
    next();
  }

  public static validateCartItemAmount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { error, value } = cart_item_amount_schema.validate(req.body);
    if (error) {
      return ValidateMiddleware.sendError(error, res);
    }
    req.body = value;
    next();
  }
}

export default ValidateMiddleware;
