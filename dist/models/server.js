"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const users_1 = __importDefault(require("../routes/users"));
const auth_1 = __importDefault(require("../routes/auth"));
const person_1 = __importDefault(require("../routes/person"));
const records_1 = __importDefault(require("../routes/records"));
class Server {
    constructor() {
        this.apiPaths = {
            users: "/api/users",
            person: "/api/person",
            auth: "/api/auth",
            records: "/api/records",
        };
        this.app = (0, express_1.default)(); //Usar Express
        this.port = process.env.PORT || "8000"; //Habilitar el puerto del .env o el 8000
        this.dbConnectionREG(); //Usar la conexion BD
        this.middlewares(); //Usar los middlewares
        this.routes(); //Usar las rutas
    }
    dbConnectionREG() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connectionResgisters_1.default.authenticate();
                console.log('Database Online');
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    middlewares() {
        this.app.use((0, cors_1.default)()); //Uso de cors para trabajar de otros computadores
        this.app.use((0, morgan_1.default)("dev")); //Muesta en consola los tipos de peticiones
        this.app.use(express_1.default.json()); //Habilita el uso del body y los transforma en json
        this.app.use(express_1.default.static('public')); // Habilita una pagina web
        this.app.use("/uploads", express_1.default.static(path_1.default.resolve("uploads"))); //?
    }
    routes() {
        this.app.use(this.apiPaths.auth, auth_1.default); //Llamo a los rutas, en este caso el userRoutes
        this.app.use(this.apiPaths.users, users_1.default);
        this.app.use(this.apiPaths.person, person_1.default);
        this.app.use(this.apiPaths.records, records_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map