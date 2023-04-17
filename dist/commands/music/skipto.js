"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SkipToCommand", {
    enumerable: true,
    get: ()=>SkipToCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class SkipToCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addIntegerOption((option)=>option.setName('track').setDescription('The track you want to skip to').setMinValue(1).setRequired(true).setAutocomplete(true));
        });
    }
    async autocompleteRun(interaction) {
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const track = interaction.options.getInteger('track');
        const skip = queue?.tracks.at(track);
        const position = queue?.node.getTrackPosition(skip);
        const tracks = queue.tracks.map((t, idx)=>({
                name: t.title,
                value: ++idx
            }));
        if (skip?.title && !tracks.some((t)=>t.name === skip.title)) {
            tracks.unshift({
                name: skip.title,
                value: position
            });
        }
        let slicedTracks = tracks.slice(0, 5);
        if (track) {
            slicedTracks = tracks.slice(track - 1, track + 4);
            if (slicedTracks.length > 5) {
                slicedTracks = slicedTracks.slice(0, 5);
            }
        }
        return interaction.respond(slicedTracks);
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
        if (!queue.tracks) return interaction.reply({
            content: `${emojis.error} | There are **no tracks** to **skip** to`,
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        const skip = interaction.options.getInteger('track') - 1;
        const trackResolvable = queue.tracks.at(skip);
        if (!trackResolvable) return interaction.reply({
            content: `${emojis.error} | The **requested track** doesn't **exist**`,
            ephemeral: true
        });
        queue.node.skipTo(trackResolvable);
        return interaction.reply({
            embeds: [
                {
                    description: `⏩ | Tracked Skipped to: **${trackResolvable.title}**`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Skips to the given track whilst removing previous tracks'
        });
    }
}
