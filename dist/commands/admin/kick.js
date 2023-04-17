"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "KickCommand", {
    enumerable: true,
    get: ()=>KickCommand
});
const _utils = require("../../lib/utils");
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
class KickCommand extends _framework.Command {
    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addUserOption((option)=>option.setName('user').setDescription('The user to kick from server').setRequired(true)).addStringOption((option)=>option.setName('reason').setDescription(`The reason to kick this user`).setRequired(true));
        });
    }
    async chatInputRun(interaction) {
        let user = interaction.options.getUser('user');
        let reason = interaction.options.getString('reason');
        let guild = interaction.guild;
        let member = guild.members.cache.find((r)=>r.id === user.id);
        try {
            if (!interaction.memberPermissions.has('KickMembers')) {
                return interaction.reply({
                    embeds: [
                        {
                            description: `${_utils.emojis.error} | You don't have permission to run this command`,
                            color: _discord.Colors.Orange
                        }
                    ]
                });
            }
            member.kick(reason).catch((err)=>{
                if (err) {
                    interaction.reply({
                        embeds: [
                            {
                                description: `${_utils.emojis.error} | I was unable to kick ${user}`,
                                color: _discord.Colors.Orange
                            }
                        ]
                    });
                    return;
                }
            });
            interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.success} | ${user} was kicked from the server by ${interaction.user}`,
                        color: _discord.Colors.Blurple
                    }
                ],
                fetchReply: true
            });
            return user.send({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | You were kicked from **${interaction.guild.name}** for: ${reason}`,
                        color: _discord.Colors.Orange
                    }
                ]
            }).catch(()=>{
                return interaction.reply({
                    embeds: [
                        {
                            description: `${_utils.emojis.error} | The member was removed, but I was unable to DM the reason.`,
                            color: _discord.Colors.Orange
                        }
                    ],
                    fetchReply: true
                });
            });
        } catch (err) {
            return interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | I was unable to kick ${user}`,
                        color: _discord.Colors.Orange
                    }
                ],
                fetchReply: true
            });
        }
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Removes a member from the server'
        });
    }
}
