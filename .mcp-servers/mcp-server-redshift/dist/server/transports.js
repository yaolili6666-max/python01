import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
export async function setupTransport(server) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server started"); // 日志走 stderr，stdout 留给 JSON-RPC
}
