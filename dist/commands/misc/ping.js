"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PingCommand", {
    enumerable: true,
    get: ()=>PingCommand
});
const _discordjsutilities = require("@sapphire/discord.js-utilities");
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
class PingCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description);
        });
        registry.registerContextMenuCommand((builder)=>{
            builder.setName(this.name).setType(_discord.ApplicationCommandType.Message);
        });
        registry.registerContextMenuCommand((builder)=>{
            builder.setName(this.name).setType(_discord.ApplicationCommandType.User);
        });
    }
    async chatInputRun(interaction) {
        const msg = await interaction.reply({
            content: `Pinging...`,
            fetchReply: true
        });
        if ((0, _discordjsutilities.isMessageInstance)(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            return interaction.editReply(`The round trip took **${diff}ms** and the heartbeat being **${ping}ms**`);
        }
        return interaction.editReply('Failed to retrieve ping...');
    }
    async contextMenuRun(interaction) {
        const msg = await interaction.reply({
            content: `Pinging...`,
            fetchReply: true
        });
        if ((0, _discordjsutilities.isMessageInstance)(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            return interaction.editReply(`The round trip took **${diff}ms** and the heartbeat being **${ping}ms**`);
        }
        return interaction.editReply('Failed to retrieve ping...');
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: 'Returns the round trip and heartbeat'
        });
    }
}
