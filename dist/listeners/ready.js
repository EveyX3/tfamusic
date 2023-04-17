"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserEvent", {
    enumerable: true,
    get: ()=>UserEvent
});
const _framework = require("@sapphire/framework");
class UserEvent extends _framework.Listener {
    run() {
        this.container.client.logger.info(`Successfully logged in as: ${this.container.client.user?.username}`);
    }
    constructor(context, options){
        super(context, {
            ...options,
            once: true
        });
    }
}
