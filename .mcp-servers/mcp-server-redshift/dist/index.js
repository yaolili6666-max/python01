import { validateConfig } from "./config/database.js";
import { createServer } from "./server/setup.js";
import { setupTransport } from "./server/transports.js";
async function main() {
    validateConfig();
    const server = createServer();
    await setupTransport(server);
}
main().catch(console.error);
