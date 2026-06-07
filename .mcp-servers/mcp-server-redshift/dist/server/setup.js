import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { handleListTables } from "../tools/listTables.js";
import { handleGetTablesSchema } from "../tools/getTablesSchema.js";
import { handleQuery } from "../tools/query.js";
export function createServer() {
    const server = new Server({ name: "mcp-server-redshift", version: "0.1.0" }, { capabilities: { tools: {} } });
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            { name: "list_tables", description: "List tables in schemas",
                inputSchema: { type: "object", properties: { schemas: { type: "array", items: { type: "string" } } } } },
            { name: "get_tables_schema", description: "Get columns for multiple tables",
                inputSchema: { type: "object", required: ["tables"], properties: {
                        tables: { type: "array", items: { type: "object", required: ["schema", "table"],
                                properties: { schema: { type: "string" }, table: { type: "string" } } } }
                    } } },
            { name: "query", description: "Execute a read-only SQL query",
                inputSchema: { type: "object", required: ["sql"], properties: { sql: { type: "string" } } } }
        ]
    }));
    server.setRequestHandler(CallToolRequestSchema, async (req) => {
        const args = req.params.arguments || {};
        let result;
        switch (req.params.name) {
            case "list_tables":
                result = await handleListTables(args.schemas);
                break;
            case "get_tables_schema":
                result = await handleGetTablesSchema(args.tables);
                break;
            case "query":
                result = await handleQuery(args.sql);
                break;
            default: throw new Error(`Unknown tool: ${req.params.name}`);
        }
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], isError: false };
    });
    return server;
}
