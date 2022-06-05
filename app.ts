import dotenv from "dotenv";
import Server from "./models/server";

dotenv.config(); //Habilito el dotenv en la app

const server = new Server(); //Instancio el server

server.listen(); //Ejecuto el server
