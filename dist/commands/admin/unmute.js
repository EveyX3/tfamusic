"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnmuteCommand", {
    enumerable: true,
    get: ()=>UnmuteCommand
});
const _utils = require("../../lib/utils");
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
class UnmuteCommand extends _framework.Command {
    async registerApplicationCommands(registery) {
        registery.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addUserOption((option)=>option.setName('user').setDescription(`The member to unmute`).setRequired(true));
        });
    }
    async chatInputRun(interaction) {
        let user = interaction.options.getUser('user');
        let member = interaction.guild.members.cache.find((r)=>r.id === user.id);
        try {
            if (!interaction.memberPermissions.has('MuteMembers')) {
                return interaction.reply({
                    embeds: [
                        {
                            description: `${_utils.emojis.error} | You don't have permission to run this command`,
                            color: _discord.Colors.Orange
                        }
                    ]
                });
            }
            if (!member?.isCommunicationDisabled().valueOf() === true) return interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | This user is not muted`,
                        color: _discord.Colors.Orange
                    }
                ]
            });
            member.timeout(0.1);
            return interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.success} | ${member.user} was unmuted by ${interaction.user}`,
                        color: _discord.Colors.Blurple
                    }
                ]
            });
        } catch (e) {
            return await interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | I was unable to unmute ${user}`,
                        color: _discord.Colors.Orange
                    }
                ]
            });
        }
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Unmutes a member'
        });
    }
}
