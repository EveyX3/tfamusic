import { emojis } from "#lib/utils";
import { Command, err } from "@sapphire/framework";
import { Colors } from "discord.js";

export class KickCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Removes a member from the server'
        });
    }
    public override async registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption(option => option.setName('user').setDescription('The user to kick from server').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(`The reason to kick this user`).setRequired(true))
        })
    }
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        let user = interaction.options.getUser('user')
        let reason = interaction.options.getString('reason')
        let guild = interaction.guild
        let member = guild.members.cache.find((r) => r.id === user.id)
        try {
            if (!interaction.memberPermissions.has('KickMembers')) {
                return interaction.reply({
                    embeds: [{
                        description: `${emojis.error} | You don't have permission to run this command`,
                        color: Colors.Orange
                    }]
                })
            }
            member.kick(reason).catch((err) => {
                if (err) {
                    interaction.reply({
                        embeds: [{
                            description: `${emojis.error} | I was unable to kick ${user}`,
                            color: Colors.Orange
                        }],
                    })
                    return
                }
            })
            interaction.reply({
                embeds: [{
                    description: `${emojis.success} | ${user} was kicked from the server by ${interaction.user}`,
                    color: Colors.Blurple
                }],
                fetchReply: true
            })
            return user.send({
                embeds: [{
                    description: `${emojis.error} | You were kicked from **${interaction.guild.name}** for: ${reason}`,
                    color: Colors.Orange
                }]
            }).catch(() => {
                return interaction.reply({
                    embeds: [{
                        description: `${emojis.error} | The member was removed, but I was unable to DM the reason.`,
                        color: Colors.Orange
                    }],
                    fetchReply: true
                })
            })
        } catch (err) {
            return interaction.reply({
                embeds: [{
                    description: `${emojis.error} | I was unable to kick ${user}`,
                    color: Colors.Orange
                }],
                fetchReply: true
            })
        }
    }
}