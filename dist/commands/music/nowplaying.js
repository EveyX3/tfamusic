"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NowPlayingCommand", {
    enumerable: true,
    get: ()=>NowPlayingCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class NowPlayingCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description);
        });
    }
    async chatInputRun(interaction) {
        const { emojis  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const timeline = (0, _discordplayer.useTimeline)(interaction.guild.id);
        if (!queue) return interaction.reply({
            content: `${emojis.error} | I am **not** in a voice channel`,
            ephemeral: true
        });
        if (!queue.currentTrack) return interaction.reply({
            content: `${emojis.error} | There is no track **currently** playing`,
            ephemeral: true
        });
        const track = queue.currentTrack;
        const embed = new _discord.EmbedBuilder().setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        }).setColor('Red').setTitle('💿 Now Playing').setDescription(`[${track.title}](${track.url})`).setThumbnail(track.thumbnail ?? interaction.user.displayAvatarURL()).addFields([
            {
                name: 'Author',
                value: track.author
            },
            {
                name: 'Progress',
                value: `${queue.node.createProgressBar()} (${timeline.timestamp?.progress}%)`
            },
            {
                name: 'Extractor',
                value: `\`${track.extractor?.identifier || 'N/A'}\``
            }
        ]).setFooter({
            text: `Ping: ${queue.ping}ms | Event Loop Lag: ${queue.player.eventLoopLag.toFixed(0)}ms`
        });
        return interaction.reply({
            embeds: [
                embed
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Displays the current track in an embed'
        });
    }
}
