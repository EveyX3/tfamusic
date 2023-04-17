"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreviousCommand", {
    enumerable: true,
    get: ()=>PreviousCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class PreviousCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description);
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const history = (0, _discordplayer.useHistory)(interaction.guild.id);
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
        if (!history?.previousTrack) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | No tracks in history`,
                    color: _discord.Colors.Blurple
                }
            ],
            ephemeral: true
        });
        await history.previous();
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | Replaying last track`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Plays the previous track'
        });
    }
}
