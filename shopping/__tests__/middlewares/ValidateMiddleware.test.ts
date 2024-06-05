import { NextFunction, Request, Response } from "express";
import ValidateMiddleware from "../../src/api/middlewares/ValidateMiddleware.js";

describe("Test ValidateMiddleware.validateCartItemAmount", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("Test validateCartItemAmount with correct amount", () => {
    req.body = { amount: 3 };
    ValidateMiddleware.validateCartItemAmount(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalled();
  });

  test("Test validateCartItemAmount with double amount", () => {
    req.body = { amount: 5.2 };
    ValidateMiddleware.validateCartItemAmount(
      req as Request,
      res as Response,
      next
    );
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "number.integer",
      message: '"amount" must be an integer',
    });
  });

  test("Test validateCartItemAmount with negative amount", () => {
    req.body = { amount: -3 };
    ValidateMiddleware.validateCartItemAmount(
      req as Request,
      res as Response,
      next
    );
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "number.min",
      message: '"amount" must be greater than or equal to 1',
    });
  });

  test("Test validateCartItemAmount with missing amount", () => {
    req.body = {};
    ValidateMiddleware.validateCartItemAmount(
      req as Request,
      res as Response,
      next
    );
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "any.required",
      message: '"amount" is required',
    });
  });
});

describe("Test ValidateMiddleware.validateCartItem", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("Test validateCartItem with correct amount and product_id", () => {
    req.body = { product_id: "id123", amount: 3 };
    ValidateMiddleware.validateCartItem(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  test("Test validateCartItem with correct amount and wrong product_id", () => {
    req.body = { product_id: 241, amount: 3 };
    ValidateMiddleware.validateCartItem(req as Request, res as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "string.base",
      message: '"product_id" must be a string',
    });
  });

  test("Test validateCartItem with correct amount and missing product_id", () => {
    req.body = { amount: 3 };
    ValidateMiddleware.validateCartItem(req as Request, res as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "any.required",
      message: '"product_id" is required',
    });
  });

  test("Test validateCartItem with missing amount and correct product_id", () => {
    req.body = { product_id: "id123" };
    ValidateMiddleware.validateCartItem(req as Request, res as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "any.required",
      message: '"amount" is required',
    });
  });

  test("Test validateCartItem with a non recognized property", () => {
    req.body = { product_id: "id123", amount: 3, something: "else" };
    ValidateMiddleware.validateCartItem(req as Request, res as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "object.unknown",
      message: '"something" is not allowed',
    });
  });

  // test("Test validateCartItemAmount with double amount", () => {
  //   req.body = { amount: 5.2 };
  //   ValidateMiddleware.validateCartItemAmount(
  //     req as Request,
  //     res as Response,
  //     next
  //   );
  //   expect(next).not.toHaveBeenCalled();
  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "number.integer",
  //     message: '"amount" must be an integer',
  //   });
  // });

  // test("Test validateCartItemAmount with negative amount", () => {
  //   req.body = { amount: -3 };
  //   ValidateMiddleware.validateCartItemAmount(
  //     req as Request,
  //     res as Response,
  //     next
  //   );
  //   expect(next).not.toHaveBeenCalled();
  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "number.min",
  //     message: '"amount" must be greater than or equal to 1',
  //   });
  // });

  // test("Test validateCartItemAmount with missing amount", () => {
  //   req.body = {};
  //   ValidateMiddleware.validateCartItemAmount(
  //     req as Request,
  //     res as Response,
  //     next
  //   );
  //   expect(next).not.toHaveBeenCalled();
  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "any.required",
  //     message: '"amount" is required',
  //   });
  // });
});
