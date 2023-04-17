"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ShuffleCommand", {
    enumerable: true,
    get: ()=>ShuffleCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class ShuffleCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description);
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const permissions = voice(interaction);
        if (!queue) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | I must be in the voice channel`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        if (queue.tracks.size < 2) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | Not enough tracks to shuffle`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        queue.tracks.shuffle();
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | Now shuffling the queue`,
                    color: _discord.Colors.Orange
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Shuffles the tracks in the queue'
        });
    }
}
