"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DisconnectCommand", {
    enumerable: true,
    get: ()=>DisconnectCommand
});
const _framework = require("@sapphire/framework");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
class DisconnectCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder //
            .setName(this.name).setDescription(this.description);
        });
    }
    async chatInputRun(interaction) {
        if (interaction.member instanceof _discord.GuildMember) {
            const { emojis , voice , options  } = this.container.client.utils;
            const permissions = voice(interaction);
            if (permissions.member) return interaction.reply({
                content: permissions.member,
                ephemeral: true
            });
            if (permissions.client) return interaction.reply({
                content: permissions.client,
                ephemeral: true
            });
            const queue = (0, _discordplayer.useQueue)(interaction.guild.id);
            const player = (0, _discordplayer.useMasterPlayer)();
            if (queue) return interaction.reply({
                embeds: [
                    {
                        description: `${emojis.error} | I'm currently in a voice channel`,
                        color: _discord.Colors.Orange
                    }
                ],
                ephemeral: true
            });
            const newQueue = player?.queues.create(interaction.guild.id, options(interaction));
            await newQueue?.connect(interaction.member.voice.channel.id);
            return interaction.reply({
                embeds: [
                    {
                        description: `${emojis.success} | I have connected to ${interaction.member.voice.channel}`,
                        color: _discord.Colors.Blurple
                    }
                ]
            });
        }
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Connects the bot to the voice channel while also creating a new queue'
        });
    }
}
