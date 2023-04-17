"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoopCommand", {
    enumerable: true,
    get: ()=>LoopCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
const repeatModes = [
    {
        name: 'Off',
        value: _discordplayer.QueueRepeatMode.OFF
    },
    {
        name: 'Track',
        value: _discordplayer.QueueRepeatMode.TRACK
    },
    {
        name: 'Queue',
        value: _discordplayer.QueueRepeatMode.QUEUE
    },
    {
        name: 'Autoplay',
        value: _discordplayer.QueueRepeatMode.AUTOPLAY
    }
];
class LoopCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description).addNumberOption((option)=>option.setName('mode').setDescription('Choose a loop mode').setRequired(true).addChoices(...repeatModes));
        });
    }
    async chatInputRun(interaction) {
        const { emojis , voice  } = this.container.client.utils;
        const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
        const permissions = voice(interaction);
        if (!queue) return interaction.reply({
            content: `${emojis.error} | I am **not** in a voice channel`,
            ephemeral: true
        });
        if (!queue.currentTrack) return interaction.reply({
            content: `${emojis.error} | There is no track **currently** playing`,
            ephemeral: true
        });
        if (permissions.clientToMember) return interaction.reply({
            content: permissions.clientToMember,
            ephemeral: true
        });
        const mode = interaction.options.getNumber('mode', true);
        const name = mode === _discordplayer.QueueRepeatMode.OFF ? 'Looping' : repeatModes.find((m)=>m.value === mode)?.name;
        queue.setRepeatMode(mode);
        return interaction.reply({
            embeds: [
                {
                    description: `${emojis.success} | \`${name}\` has been **${mode === queue.repeatMode ? 'enabled' : 'disabled'}**`,
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Loops the current playing track or the entire queue'
        });
    }
}
