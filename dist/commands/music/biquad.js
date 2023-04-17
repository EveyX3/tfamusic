"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BiquadCommand", {
    enumerable: true,
    get: ()=>BiquadCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class BiquadCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        const biquadFilters = Object.keys(_discordplayer.BiquadFilterType).filter((k)=>typeof k[0] === 'string').map((m)=>({
                name: m,
                value: m
            }));
        biquadFilters.unshift({
            name: 'Disable',
            value: 'Off'
        });
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addStringOption((option)=>option.setName('filter').setDescription('The biquad filter to use').addChoices(...biquadFilters).setRequired(true)).addNumberOption((option)=>{
                return option.setMinValue(-50).setMaxValue(50).setName('gain').setDescription('The dB gain value').setRequired(false);
            });
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const permissions = voice(interaction);
        const filter = interaction.options.getString('filter', true);
        const dB = interaction.options.getNumber('gain');
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
        if (!queue.filters.biquad) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | The biquad filters are unavailable for this queue`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (filter === 'Off') {
            queue.filters.biquad.disable();
        } else {
            if (typeof dB === 'number') queue.filters.biquad.setGain(dB);
            queue.filters.biquad.enable();
            queue.filters.biquad.setFilter(_discordplayer.BiquadFilterType[filter]);
        }
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | The biquad filter has been set to: **${filter}**`
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'The biquad filter that can be applied to tracks'
        });
    }
}
