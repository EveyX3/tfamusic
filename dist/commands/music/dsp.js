"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PulsatorCommand", {
    enumerable: true,
    get: ()=>PulsatorCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class PulsatorCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addStringOption((option)=>option.setName('filter').setDescription('The filter to toggle').addChoices(...Object.keys(_discordplayer.PCMAudioFilters).map((m)=>({
                        name: m,
                        value: m
                    }))).setRequired(true));
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const permissions = voice(interaction);
        const filter = interaction.options.getString('filter');
        if (!queue) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | I must be in the voice channel`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (!queue.currentTrack) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | There is no track currently playing`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        if (!queue.filters.filters) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | The DSP filters are not available for this queue`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        let ff = queue.filters.filters.filters;
        if (ff.includes(filter)) {
            ff = ff.filter((r)=>r !== filter);
        } else {
            ff.push(filter);
        }
        queue.filters.filters.setFilters(ff);
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | The ${filter} filter has been ${ff.includes(filter) ? "disabled" : "enabled"}`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'The DSP filters that can be applied to tracks'
        });
    }
}
