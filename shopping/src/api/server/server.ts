import express, { Express } from "express";
import helmet from "helmet";
import CartController from "../controllers/CartController.js";
import DefaultController from "../controllers/DefaultController.js";
import CartRepositoryJson from "../../repository/CartRepositoryJson.js";
import CartService from "../../service/CartService.js";

class Server {
  private app: Express;
  private cart_repository: CartRepositoryJson;
  private cart_service: CartService;
  private cart_controller: CartController;
  private port: string;

  constructor(port: string) {
    this.port = port;
    this.app = express();
    this.app.use(helmet());
    this.app.use(express.json());

    this.cart_repository = new CartRepositoryJson();
    this.cart_service = new CartService(this.cart_repository);
    this.cart_controller = new CartController(this.cart_service);
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
