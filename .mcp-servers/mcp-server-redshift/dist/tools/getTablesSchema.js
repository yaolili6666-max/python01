import { pool } from "../config/pool.js";
export async function handleGetTablesSchema(tables) {
    const client = await pool.connect();
    try {
        const results = [];
        for (const { schema, table } of tables) {
            const result = await client.query(`
        SELECT column_name AS name, data_type AS "dataType",
               is_nullable = 'YES' AS "isNullable"
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position`, [schema, table]);
            results.push({ schema, table, columns: result.rows });
        }
        return results;
    }
    finally {
        client.release();
    }
}
