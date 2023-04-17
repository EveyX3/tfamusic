"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HugCommand", {
    enumerable: true,
    get: ()=>HugCommand
});
const _utils = require("../../lib/utils");
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
class HugCommand extends _framework.Command {
    async registerApplicationCommands(registery) {
        registery.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addUserOption((option)=>option.setName(`user`).setDescription(`The user to hug`).setRequired(true));
        });
    }
    async chatInputRun(interaction) {
        return interaction.reply({
            embeds: [
                {
                    description: `${_utils.emojis.sparkspin} | Currently being worked on`,
                    color: _discord.Colors.Red
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: `Hug a friend of yours!`
        });
    }
}
