"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    voice: ()=>voice,
    options: ()=>options,
    emojis: ()=>emojis,
    logSuccessCommand: ()=>logSuccessCommand
});
const _framework = require("@sapphire/framework");
const _colorette = require("colorette");
const _discord = require("discord.js");
function isGuildTextBasedChannel(interaction) {
    if ('applicationId' in interaction) return false;
    return true;
}
function voice(interaction) {
    if (isGuildTextBasedChannel(interaction)) {
        return {
            get events () {
                const resolved = new _discord.PermissionsBitField([
                    _discord.PermissionsBitField.Flags.SendMessages,
                    _discord.PermissionsBitField.Flags.ViewChannel
                ]);
                const missingPerms = interaction.permissionsFor(interaction.guild.members.me).missing(resolved);
                return missingPerms.length;
            }
        };
    }
    const interactionMember = interaction.member;
    return {
        get member () {
            if (!interactionMember.voice.channel) return `${emojis.error} | You must be in a voice channel`;
        },
        get client () {
            const resolved = new _discord.PermissionsBitField([
                _discord.PermissionsBitField.Flags.Connect,
                _discord.PermissionsBitField.Flags.Speak,
                _discord.PermissionsBitField.Flags.ViewChannel
            ]);
            const missingPerms = interactionMember.voice.channel.permissionsFor(interaction.guild.members.me).missing(resolved);
            if (missingPerms.length) return `${emojis.error} | I am missing the required voice channel permissions: \`${missingPerms.join(', ')}\``;
        },
        get clientToMember () {
            if (interaction.guild?.members.me?.voice.channelId && interactionMember.voice.channelId !== interaction.guild?.members.me?.voice.channelId) return `${emojis.error} | You must be in my voice channel`;
        }
    };
}
function options(interaction) {
    return {
        metadata: {
            channel: interaction.channel,
            client: interaction.guild?.members.me
        },
        leaveOnEmptyCooldown: 300000,
        leaveOnEmpty: true,
        leaveOnEnd: false,
        bufferingTimeout: 0,
        selfDeaf: true
    };
}
const emojis = {
    get success () {
        return '<:success:1096219310134927370>';
    },
    get error () {
        return '<:failed:1096219287707992144>';
    },
    get sparkspin () {
        return '<a:sparkspin:1096649310164226148>';
    }
};
function logSuccessCommand(payload) {
    let successLoggerData;
    if ('interaction' in payload) {
        successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
    } else {
        successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
    }
    _framework.container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}
function getSuccessLoggerData(guild, user, command) {
    const shard = `[${(0, _colorette.cyan)(guild?.shardId || 0).toString()}]`;
    const commandName = (0, _colorette.cyan)(command.name);
    const author = `${user.username}[${(0, _colorette.cyan)(user.id)}]`;
    const sentAt = guild ? `${guild.name}[${(0, _colorette.cyan)(guild.id)}]` : 'Direct Messages';
    return {
        shard,
        commandName,
        author,
        sentAt
    };
}
