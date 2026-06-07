import { pool } from "../config/pool.js";
import { config } from "../config/database.js";
export async function handleListTables(schemas) {
    const client = await pool.connect();
    try {
        const list = (schemas || config.schemas).map(s => `'${s}'`).join(",");
        const result = await client.query(`
      SELECT table_schema AS schema, table_name AS name, table_type AS type,
        COALESCE((SELECT pg_catalog.obj_description(c.oid)
                    FROM pg_catalog.pg_class c
                   WHERE c.relname = t.table_name
                     AND c.relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = t.table_schema)
                 ), '') AS description
      FROM information_schema.tables t
      WHERE table_schema IN (${list})
        AND table_type IN ('BASE TABLE', 'VIEW', 'MATERIALIZED VIEW')
      ORDER BY table_schema, table_name`);
        return result.rows;
    }
    finally {
        client.release();
    }
}
