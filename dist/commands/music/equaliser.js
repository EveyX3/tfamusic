"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EqualizerCommand", {
    enumerable: true,
    get: ()=>EqualizerCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class EqualizerCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addStringOption((option)=>option.setName('preset').setDescription('The equaliser filter to use').addChoices(...Object.keys(_discordplayer.EqualizerConfigurationPreset).map((m)=>({
                        name: m,
                        value: m
                    }))).setRequired(true));
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const permissions = voice(interaction);
        const preset = interaction.options.getString('preset');
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
        if (!queue.filters.equalizer) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | The equaliser is not available for this queue`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        queue.filters.equalizer.setEQ(_discordplayer.EqualizerConfigurationPreset[preset]);
        queue.filters.equalizer.enable();
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | The equaliser filter has been set to \`${preset}\``,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'The equaliser filter that can be applied to tracks'
        });
    }
}
