"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClearCommand", {
    enumerable: true,
    get: ()=>ClearCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class ClearCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addBooleanOption((option)=>option.setName('history').setDescription('Clear the queue history'));
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const permissions = voice(interaction);
        const history = interaction.options.getBoolean('history');
        if (!queue) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | I must be in the voice channel`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (!queue.tracks) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | There is no tracks to remove`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        queue.tracks.clear();
        if (history) queue.history.clear();
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | The queue has been cleared of ${queue.tracks.map((q)=>q).length} track(s)`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Clears the current queue and removes all enqueued tracks'
        });
    }
}
