"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FiltersCommand", {
    enumerable: true,
    get: ()=>FiltersCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class FiltersCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addStringOption((option)=>option.setName('filter').setDescription('The FFmpeg filter to use').addChoices({
                    name: 'Off',
                    value: 'Off'
                }, ...[
                    {
                        name: 'lofi',
                        value: 'lofi'
                    },
                    {
                        name: '8D',
                        value: '8D'
                    },
                    {
                        name: 'bassboost',
                        value: 'bassboost'
                    },
                    {
                        name: 'compressor',
                        value: 'compressor'
                    },
                    {
                        name: 'karaoke',
                        value: 'karaoke'
                    },
                    {
                        name: 'vibrato',
                        value: 'vibrato'
                    },
                    {
                        name: 'vaporwave',
                        value: 'vaporwave'
                    },
                    {
                        name: 'nightcore',
                        value: 'nightcore'
                    },
                    {
                        name: 'tremolo',
                        value: 'tremolo'
                    }
                ]).setRequired(true));
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
                    description: `${emojis.error} | No track is currently playing`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        if (!queue.filters.ffmpeg) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | FFmpeg filters are not available for this queue!`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (filter === 'Off') {
            await queue.filters.ffmpeg.setFilters(false);
            return interaction.reply({
                embeds: [
                    {
                        description: `${emojis.success} | The audio filters have been disabled`,
                        color: _discord.Colors.Blurple
                    }
                ]
            });
        }
        await queue.filters.ffmpeg.toggle(filter.includes('bassboost') ? [
            'bassboost',
            'normalizer'
        ] : filter);
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | The ${filter} filter has been **${queue.filters.ffmpeg.isEnabled(filter) ? 'enabled' : 'disabled'}**`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'The FFmpeg filters that can be applied to tracks'
        });
    }
}
