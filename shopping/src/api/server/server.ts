import express, { Express } from "express";
import helmet from "helmet";
import CartController from "../controllers/CartController.js";
import DefaultController from "../controllers/DefaultController.js";

class Server {
  private app: Express;
  private cart_controller: CartController;
  private port: string;

  constructor(port: string) {
    this.port = port;
    this.app = express();
    this.app.use(helmet());
    this.app.use(express.json());
    this.cart_controller = new CartController();
    this.app.use("/api/v1/cart", this.cart_controller.router);

    this.app.use(DefaultController.handleNotFound);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
