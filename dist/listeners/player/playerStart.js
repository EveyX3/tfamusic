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
    run(queue, track) {
        const { voice  } = _framework.container.client.utils;
        const permissions = voice(queue.metadata.channel);
        if (permissions.events) return;
        const row = new _discord.ActionRowBuilder().addComponents(new _discord.ButtonBuilder().setCustomId('resume').setEmoji(`▶️`).setStyle(_discord.ButtonStyle.Primary), new _discord.ButtonBuilder().setCustomId('pause').setEmoji(`⏸️`).setStyle(_discord.ButtonStyle.Primary));
        const i = queue.metadata.channel.send({
            embeds: [
                {
                    title: `💿 Now Playing`,
                    description: `[${track.title} | ${track.author}](${track.url})`,
                    fields: [
                        {
                            name: `Author`,
                            value: `${track.author}`,
                            inline: true
                        },
                        {
                            name: `Duration`,
                            value: `${track.duration}`,
                            inline: true
                        },
                        {
                            name: `Requested By`,
                            value: `${track.requestedBy}`,
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: `${track.thumbnail}`
                    },
                    color: _discord.Colors.Blurple
                }
            ]
        });
        const collector = queue.metadata.channel.createMessageComponentCollector({
            time: track.durationMS,
            max: 1
        });
        collector.on('collect', (i)=>{
            i.deferUpdate();
            console.log(`${i} has been clicked`);
        });
        collector.on('end', (i)=>{
            (m)=>m.delete();
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            emitter: _framework.container.client.player.events,
            event: 'playerStart'
        });
    }
}
