import Server from "./api/server/server.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || "3001";

const server = new Server(PORT);

server.start();
