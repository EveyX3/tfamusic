"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlayerEvent", {
    enumerable: true,
    get: ()=>PlayerEvent
});
const _utils = require("../../lib/utils");
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
class PlayerEvent extends _framework.Listener {
    run(queue) {
        const { voice  } = _framework.container.client.utils;
        const permissions = voice(queue.metadata.channel);
        if (permissions.events) return;
        return queue.metadata.channel.send({
            embeds: [
                {
                    description: `${_utils.emojis.success} | I was manually disconnected from ${queue.channel}`,
                    color: _discord.Colors.Blurple
                }
            ]
        }).then((m)=>setTimeout(()=>m.delete(), 15000));
    }
    constructor(context, options){
        super(context, {
            ...options,
            emitter: _framework.container.client.player.events,
            event: 'disconnect'
        });
    }
}
