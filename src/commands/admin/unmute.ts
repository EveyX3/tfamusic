import { emojis } from "#lib/utils";
import { Command } from "@sapphire/framework";
import { Colors } from "discord.js";
import ms from 'ms';
export class UnmuteCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Unmutes a member'
        });
    }
    public override async registerApplicationCommands(registery: Command.Registry) {
        registery.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption(option => option.setName('user').setDescription(`The member to unmute`).setRequired(true))
        })
    }
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        let user = interaction.options.getUser('user')
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
            if (!member?.isCommunicationDisabled().valueOf() === true) return interaction.reply({
                embeds: [{
                    description: `${emojis.error} | This user is not muted`,
                    color: Colors.Orange
                }]
            })
            member.timeout(0.1)
            return interaction.reply({
                embeds: [{
                    description: `${emojis.success} | ${member.user} was unmuted by ${interaction.user}`,
                    color: Colors.Blurple
                }]
            })
        } catch (e) {
            return await interaction.reply({
                embeds: [{
                    description: `${emojis.error} | I was unable to unmute ${user}`,
                    color: Colors.Orange
                }]
            })
        }
    }
}