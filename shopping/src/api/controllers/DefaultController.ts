import { Request, Response } from "express";

class DefaultController {
  public handleNotFound(req: Request, res: Response): void {
    res.status(404).json({
      error: "endpoint not found",
    });
  }
}

export default new DefaultController();
