"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VolumeCommand", {
    enumerable: true,
    get: ()=>VolumeCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class VolumeCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addIntegerOption((option)=>option.setName('amount').setDescription('The amount of volume you want to change to').setMinValue(0).setMaxValue(100));
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const timeline = (0, _discordplayer.useTimeline)(interaction.guild.id);
        const permissions = voice(interaction);
        const volume = interaction.options.getInteger('amount');
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
                    description: `${emojis.error} | No track is playing`
                }
            ],
            ephemeral: true
        });
        if (!volume) return interaction.reply({
            embeds: [
                {
                    description: `🔊 Volume is: **${timeline.volume}**`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        timeline.setVolume(volume);
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | Volume has been set to: \`${timeline.volume}%\``,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Changes the volume of the track and entire queue'
        });
    }
}
