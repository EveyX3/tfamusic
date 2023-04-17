import { emojis } from "#lib/utils";
import { Command } from "@sapphire/framework";
import { Colors } from "discord.js";
import ms from 'ms';
export class MuteCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Mutes a member'
        });
    }
    public override async registerApplicationCommands(registery: Command.Registry) {
        registery.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption(option => option.setName('user').setDescription(`The member to mute`).setRequired(true))
                .addStringOption(option => option.setName('duration').setDescription('The duration to mute this member').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(`The reason to mute this user`))
        })
    }
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        let user = interaction.options.getUser('user')
        let duration = interaction.options.getString('duration')
        let reason = interaction.options.getString('reason') || "No reason provided"
        let member = interaction.guild.members.cache.find((r) => r.id === user.id)

        try {
            if (!interaction.memberPermissions.has('MuteMembers')) {
                return interaction.reply({
                    embeds: [{
                        description: `${emojis.error} | You don't have permission to run this command`,
                        color: Colors.Orange
                    }]
                })
            }
            if (member?.isCommunicationDisabled().valueOf() === true) return interaction.reply({
                embeds: [{
                    description: `${emojis.error} | This user is muted`,
                    color: Colors.Orange
                }]
            })
            member.timeout(ms(duration), reason)
            await interaction.reply({
                embeds: [{
                    description: `${emojis.success} | ${member.user} was muted by ${interaction.user} for ${ms(ms(duration))}`,
                    color: Colors.Blurple
                }]
            })
            user.send({
                embeds: [{
                    description: `${emojis.error} | You were muted in **${interaction.guild.name}** for: ${reason}`,
                    color: Colors.Orange
                }]
            }).catch(async (e) => {
                return interaction.followUp({
                    embeds: [{
                        description: `${emojis.error} | Couldn't notify ${user}`,
                        color: Colors.Orange
                    }]
                })
            })
        } catch (e) {
            return await interaction.reply({
                embeds: [{
                    description: `${emojis.error} | I was unable to mute ${user}`,
                    color: Colors.Orange
                }]
            })
        }
    }
}