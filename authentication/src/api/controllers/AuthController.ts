import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

class AuthController {
  public router: Router;
  private private_key: string;

  constructor() {
    this.router = Router();
    this.private_key = "some-secret-key";
    this.router.post("/login", this.loginUser.bind(this));
  }

  private loginUser(req: Request, res: Response) {
    const user = {
      id: "123f82dc-8255-4859-bef1-43b3b4d6abd7",
      email: "johndoe@example.com",
      password: "123",
    };

    const token = jwt.sign(
      {
        sub: user.id,
      },
      this.private_key,
      { expiresIn: "1h" }
    );

    res.json({ token });
  }
}

export default AuthController;
