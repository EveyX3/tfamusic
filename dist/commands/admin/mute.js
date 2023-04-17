"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MuteCommand", {
    enumerable: true,
    get: ()=>MuteCommand
});
const _utils = require("../../lib/utils");
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class MuteCommand extends _framework.Command {
    async registerApplicationCommands(registery) {
        registery.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addUserOption((option)=>option.setName('user').setDescription(`The member to mute`).setRequired(true)).addStringOption((option)=>option.setName('duration').setDescription('The duration to mute this member').setRequired(true)).addStringOption((option)=>option.setName('reason').setDescription(`The reason to mute this user`));
        });
    }
    async chatInputRun(interaction) {
        let user = interaction.options.getUser('user');
        let duration = interaction.options.getString('duration');
        let reason = interaction.options.getString('reason') || "No reason provided";
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
            if (member?.isCommunicationDisabled().valueOf() === true) return interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | This user is muted`,
                        color: _discord.Colors.Orange
                    }
                ]
            });
            member.timeout((0, _ms.default)(duration), reason);
            await interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.success} | ${member.user} was muted by ${interaction.user} for ${(0, _ms.default)((0, _ms.default)(duration))}`,
                        color: _discord.Colors.Blurple
                    }
                ]
            });
            user.send({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | You were muted in **${interaction.guild.name}** for: ${reason}`,
                        color: _discord.Colors.Orange
                    }
                ]
            }).catch(async (e)=>{
                return interaction.followUp({
                    embeds: [
                        {
                            description: `${_utils.emojis.error} | Couldn't notify ${user}`,
                            color: _discord.Colors.Orange
                        }
                    ]
                });
            });
        } catch (e) {
            return await interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | I was unable to mute ${user}`,
                        color: _discord.Colors.Orange
                    }
                ]
            });
        }
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Mutes a member'
        });
    }
}
