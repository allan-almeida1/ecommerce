import express, { Express } from "express";
import helmet from "helmet";
import AuthController from "../controllers/AuthController.js";
import DefaultController from "../controllers/DefaultController.js";

class Server {
  private app: Express;
  private port: string;
  private auth_controller: AuthController;

  constructor(port: string) {
    this.port = port;
    this.auth_controller = new AuthController();
    this.app = express();
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use("/api/v1/auth", this.auth_controller.router);
    this.app.use(DefaultController.handleNotFound);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
