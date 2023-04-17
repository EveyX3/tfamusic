"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LyricsCommand", {
    enumerable: true,
    get: ()=>LyricsCommand
});
const _extractor = require("@discord-player/extractor");
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
const genius = (0, _extractor.lyricsExtractor)();
class LyricsCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addStringOption((option)=>{
                return option.setName('track').setDescription('The track of the lyrics to search');
            });
        });
    }
    async chatInputRun(interaction) {
        const { emojis  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const track = interaction.options.getString('track') || (queue?.currentTrack?.title);
        const lyrics = await genius.search(track).catch(()=>null);
        if (!lyrics) return interaction.reply({
            embeds: [
                {
                    description: `${emojis.error} | This track does not have any lyrics`,
                    color: _discord.Colors.Orange
                }
            ],
            ephemeral: true
        });
        const trimmedLyrics = lyrics.lyrics.substring(0, 1997);
        const embed = new _discord.EmbedBuilder().setTitle(lyrics.title).setURL(lyrics.url).setThumbnail(lyrics.thumbnail).setAuthor({
            name: lyrics.artist.name,
            iconURL: lyrics.artist.image,
            url: lyrics.artist.url
        }).setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics).setColor('Yellow');
        return interaction.reply({
            embeds: [
                embed
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Displays lyrics of the given track'
        });
    }
}
