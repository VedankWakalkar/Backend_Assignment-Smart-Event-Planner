import { config } from "dotenv";
import path from "path";

config({
    path:path.resolve(process.cwd(),`.env,${process.env.NODE_ENV || 'developement' }.local`)
});

export const {
    NODE_ENV,
    DB_URL,
    PORT,
    API_KEY
}=process.env;