"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRconCommand = sendRconCommand;
const rcon_client_1 = require("rcon-client");
const RCON_HOST = process.env.RCON_HOST;
const RCON_PORT = process.env.RCON_PORT ? Number(process.env.RCON_PORT) : 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD;
if (!RCON_HOST || !RCON_PASSWORD) {
    throw new Error('RCON credentials are not set in environment variables.');
}
async function sendRconCommand(command) {
    const rcon = new rcon_client_1.Rcon({
        host: RCON_HOST,
        port: RCON_PORT,
        password: RCON_PASSWORD,
    });
    await rcon.connect();
    const response = await rcon.send(command);
    await rcon.end();
    return response;
}
