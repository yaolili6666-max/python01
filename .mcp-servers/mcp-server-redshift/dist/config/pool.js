import pg from "pg";
import { config } from "./database.js";
// Redshift Serverless 拒绝非 SSL 连接，必须显式开启
export const pool = new pg.Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    ssl: { rejectUnauthorized: false },
});
