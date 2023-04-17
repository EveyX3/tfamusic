"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HistoryCommand", {
    enumerable: true,
    get: ()=>HistoryCommand
});
const _discordjsutilities = require("@sapphire/discord.js-utilities");
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class HistoryCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description);
        });
    }
    async chatInputRun(interaction) {
        const { emojis  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const history = (0, _discordplayer.useHistory)(interaction.guild.id);
        if (!queue) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | I must be in the voice channel`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (!history?.tracks) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | There is no queue history to show`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        let pagesNum = Math.ceil(queue.tracks.size / 5);
        if (pagesNum <= 0) {
            pagesNum = 1;
        }
        const tracks = history.tracks.map((track, idx)=>`**${++idx})** [${track.title}](${track.url})`);
        const paginatedMessage = new _discordjsutilities.PaginatedMessage();
        if (pagesNum > 25) pagesNum = 25;
        for(let i = 0; i < pagesNum; i++){
            const list = tracks.slice(i * 5, i * 5 + 5).join('\n');
            paginatedMessage.addPageEmbed((embed)=>embed.setColor('Blurple').setDescription(`Queue in: ${queue?.channel} \n${list === '' ? '\n*• No more queued tracks*' : `\n${list}`}
						\n`).setFooter({
                    text: `${queue.tracks.size} track(s) in queue`
                }));
        }
        return paginatedMessage.run(interaction);
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Displays the queue history in an embed'
        });
    }
}
