"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JumpCommand", {
    enumerable: true,
    get: ()=>JumpCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class JumpCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addIntegerOption((option)=>option.setName('track').setDescription('The track you want to jump to').setMinValue(1).setRequired(true).setAutocomplete(true));
        });
    }
    async autocompleteRun(interaction) {
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const track = interaction.options.getInteger('track');
        const jump = queue?.tracks.at(track);
        const position = queue?.node.getTrackPosition(jump);
        const tracks = queue.tracks.map((t, idx)=>({
                name: t.title,
                value: ++idx
            }));
        if (jump?.title && !tracks.some((t)=>t.name === jump.title)) {
            tracks.unshift({
                name: jump.title,
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
            embeds: [
                {
                    description: `${emojis.error} | There are no tracks to jump to!`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        const jump = interaction.options.getInteger('track') - 1;
        const trackResolvable = queue.tracks.at(jump);
        if (!trackResolvable) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | The requested track does not exist`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        queue.node.jump(trackResolvable);
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | I have jumped to ${trackResolvable.title}`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Jumps to the given track without removing any previous tracks'
        });
    }
}
