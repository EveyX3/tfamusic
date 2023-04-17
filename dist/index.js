"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _AuricleClient = require("./AuricleClient");
require("./lib/setup");
const client = new _AuricleClient.AuricleClient();
const main = async ()=>{
    try {
        client.logger.info('Logging in...');
        return client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};
void main();
