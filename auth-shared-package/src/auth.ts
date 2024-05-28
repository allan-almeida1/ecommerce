import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IRequestWithUser extends Request {
  user: JwtPayload;
}

class Authorization {
  public static verifyToken(req: Request, res: Response, next: NextFunction) {
    const auth_header = req.headers.authorization;
    if (!auth_header) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = auth_header.split(" ")[1];

    jwt.verify(token, "some-secret-key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      }
      (req as IRequestWithUser).user = decoded as JwtPayload;
      next();
    });
  }
}

export { IRequestWithUser, Authorization };
