import { pool } from "../config/pool.js";
export async function handleQuery(sql) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN TRANSACTION READ ONLY");
        const result = await client.query(sql);
        return result.rows;
    }
    finally {
        await client.query("ROLLBACK").catch(() => { });
        client.release();
    }
}
