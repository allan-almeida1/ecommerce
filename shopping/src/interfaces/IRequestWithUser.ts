import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IRequestWithUser extends Request {
  user: JwtPayload;
}
