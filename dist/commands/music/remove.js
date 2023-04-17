"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeCommand", {
    enumerable: true,
    get: ()=>removeCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class removeCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addIntegerOption((option)=>option.setName('track').setDescription('The track you want to remove').setMinValue(1).setRequired(true).setAutocomplete(true));
        });
    }
    async autocompleteRun(interaction) {
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const track = interaction.options.getInteger('track');
        const remove = queue?.tracks.at(track);
        const position = queue?.node.getTrackPosition(remove);
        const tracks = queue.tracks.map((t, idx)=>({
                name: t.title,
                value: ++idx
            }));
        if (remove?.title && !tracks.some((t)=>t.name === remove.title)) {
            tracks.unshift({
                name: remove.title,
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
                    description: `${emojis.error} | I must be in the voice channel`
                }
            ],
            ephemeral: true
        });
        if (!queue.tracks) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | There's no tracks to remove`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        const remove = interaction.options.getInteger('track') - 1;
        const trackResolvable = queue.tracks.at(remove);
        if (!trackResolvable) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | The requested track does not exist`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        queue.node.remove(trackResolvable);
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | Removed the track: **${trackResolvable.title}**`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Removes the given track'
        });
    }
}
