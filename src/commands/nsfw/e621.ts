import { emojis } from "#lib/utils";
import { Command } from "@sapphire/framework";
import { Colors, EmbedBuilder } from "discord.js";
const pkg = require('../../../package.json')
import e621 from 'e621-api'
import { e621PopularityStrings } from "e621-api/build/enums";
export class E621Command extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: `Search E621 for a query`
        })
    }
    public override async registerApplicationCommands(registery: Command.Registry) {
        registery.registerChatInputCommand((builder) => {
            builder
                .setNSFW(true)
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption(option => option.setName(`query`).setDescription(`The query to search`).setRequired(true))
        })
    }
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        let wrapper = new e621(`MaidBoye/${pkg.version} (https://github.com/DonovanDMC/MaidBoye)`, "EveyXD", 'VfeqUJfc6gxpHaz1djyLTk1M');
        wrapper.posts.getIndexPaginate(interaction.options.getString('query'), 1, 35, 3).then((data) => {
            let img = data[0][0].file_url
            let score = data[0][0].score

            let embed = new EmbedBuilder()
                .setTitle(`Tags: ${interaction.options.getString('query')}`)
                .setImage(img)
                .setColor(`Random`)
            return interaction.reply({
                embeds: [embed]
            })
        }).catch((err) => {
            console.log(err)
            return interaction.reply({
                embeds: [{
                    description: `${emojis.error} | Sorry, there was an error running this`,
                    color: Colors.Orange
                }]
            })
        })
    }
}