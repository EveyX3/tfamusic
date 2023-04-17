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
    run(queue, error, track) {
        const { emojis , voice  } = _framework.container.client.utils;
        const permissions = voice(queue.metadata.channel);
        if (permissions.events) return;
        console.log(error);
        return queue.metadata.channel.send(`${emojis.error} | There was an error with **${track.title}**`).then((m)=>setTimeout(()=>m.delete(), 5000));
    }
    constructor(context, options){
        super(context, {
            ...options,
            emitter: _framework.container.client.player.events,
            event: 'playerError'
        });
    }
}
