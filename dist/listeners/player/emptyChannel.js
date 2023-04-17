"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlayerEvent", {
    enumerable: true,
    get: ()=>PlayerEvent
});
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
class PlayerEvent extends _framework.Listener {
    run(queue) {
        const { voice , options  } = _framework.container.client.utils;
        const timeout = options;
        const permissions = voice(queue.metadata.channel);
        if (permissions.events) return;
        return queue.metadata.channel.send({
            embeds: [
                {
                    description: `I left ${queue.channel} due to inactivty for 5 minutes`,
                    color: _discord.Colors.Orange
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            emitter: _framework.container.client.player.events,
            event: 'emptyChannel'
        });
    }
}
