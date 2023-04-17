"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlayerEvent", {
    enumerable: true,
    get: ()=>PlayerEvent
});
const _framework = require("@sapphire/framework");
class PlayerEvent extends _framework.Listener {
    run(queue, error) {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    }
    constructor(context, options){
        super(context, {
            ...options,
            emitter: _framework.container.client.player.events,
            event: 'error'
        });
    }
}
