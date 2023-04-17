"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlayCommand", {
    enumerable: true,
    get: ()=>PlayCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class PlayCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addStringOption((option)=>{
                return option.setName('query').setDescription('A query of your choice').setRequired(true).setAutocomplete(true);
            });
        });
    }
    async autocompleteRun(interaction) {
        const player = (0, _discordplayer.useMasterPlayer)();
        const query = interaction.options.getString('query');
        const results = await player.search(query);
        let tracks;
        tracks = results.tracks.map((t)=>({
                name: t.title,
                value: t.url
            })).slice(0, 5);
        if (results.playlist) {
            tracks = results.tracks.map(()=>({
                    name: `${results.playlist.title} [playlist]`,
                    value: results.playlist.url
                })).slice(0, 1);
        }
        return interaction.respond(tracks);
    }
    async chatInputRun(interaction) {
        const { emojis , voice , options  } = this.container.client.utils;
        const player = (0, _discordplayer.useMasterPlayer)();
        const permissions = voice(interaction);
        const query = interaction.options.getString('query');
        const member = interaction.member;
        if (permissions.member) return interaction.reply({
            content: permissions.member,
            ephemeral: true
        });
        if (permissions.client) return interaction.reply({
            content: permissions.client,
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        const results = await player.search(query, {
            requestedBy: interaction.user
        });
        if (!results.hasTracks()) return interaction.reply({
            embeds: [
                {
                    description: `I could not find a track matching **${query}**`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        await interaction.deferReply();
        let queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        try {
            const res = await player.play(member.voice.channel.id, results, {
                nodeOptions: options(interaction)
            });
            interaction.options;
            return interaction.editReply({
                embeds: [
                    {
                        title: `Added To Queue`,
                        description: `
					Added ${res.track.playlist ? `**track(s) from: [**${res.track.playlist.title}**](${res.track.playlist.url})` : `[**${res.track.title}**](${res.track.url})`} to the queue
					`,
                        fields: [
                            {
                                name: `Author`,
                                value: `${res.track.playlist ? `${res.track.playlist.author}` : `${res.track.author}`} `,
                                inline: true
                            },
                            {
                                name: `Duration`,
                                value: `${res.track.playlist ? `${res.track.playlist.durationFormatted}` : `${res.track.duration}`} `,
                                inline: true
                            },
                            {
                                name: `Requested By`,
                                value: `${res.track.requestedBy} `,
                                inline: true
                            }
                        ],
                        thumbnail: {
                            url: `${res.track.playlist ? res.track.playlist.thumbnail : res.track.thumbnail} `
                        },
                        color: _discord.Colors.Blurple
                    }
                ]
            });
        } catch (error) {
            await interaction.editReply({
                content: `An ** error ** has occurred`
            });
            return console.log(error);
        }
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Plays and enqueues track(s) of the query provided'
        });
    }
}
