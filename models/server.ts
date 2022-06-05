import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import dbREG from "../db/connectionResgisters";

import userRoutes from '../routes/users'
import authRoutes from '../routes/auth'
import personRoutes from '../routes/person'
import recordsRoutes from '../routes/records'


class Server {
  private app: Application;
  private port: string;
  private apiPaths = { //Colocar aqui las rutas o paths
    users: "/api/users",
    person: "/api/person",
    auth : "/api/auth",
    records : "/api/records",
  };

  constructor() {
    this.app  = express(); //Usar Express
    this.port = process.env.PORT || "8000"; //Habilitar el puerto del .env o el 8000
    this.dbConnectionREG(); //Usar la conexion BD
    this.middlewares(); //Usar los middlewares
    this.routes(); //Usar las rutas
  }

  async dbConnectionREG(){ //Me conecto a la BD
    try {
      await dbREG.authenticate();
      console.log('Database Online');
    } catch (error: any) {
      throw new Error( error );
    }
  }

  middlewares(){
    this.app.use(cors()); //Uso de cors para trabajar de otros computadores
    this.app.use(morgan("dev")); //Muesta en consola los tipos de peticiones
    this.app.use(express.json()); //Habilita el uso del body y los transforma en json
    this.app.use(express.static('public')); // Habilita una pagina web
    this.app.use("/uploads", express.static(path.resolve("uploads"))); //?
  }

  routes(){
    this.app.use(this.apiPaths.auth, authRoutes) //Llamo a los rutas, en este caso el userRoutes
    this.app.use(this.apiPaths.users, userRoutes) 
    this.app.use(this.apiPaths.person, personRoutes) 
    this.app.use(this.apiPaths.records, recordsRoutes) 
  }

  listen() { //Funcion con la cual inicio el server
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`); 
    });
  }
}

export default Server;
