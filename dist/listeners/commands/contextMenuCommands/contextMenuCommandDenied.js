"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserEvent", {
    enumerable: true,
    get: ()=>UserEvent
});
const _duration = require("@sapphire/duration");
const _framework = require("@sapphire/framework");
class UserEvent extends _framework.Listener {
    run({ identifier , context , message: content  }, { interaction  }) {
        // `context: { silent: true }` should make UserError silent:
        // Use cases for this are for example permissions error when running the `eval` command.
        if (Reflect.get(Object(context), 'silent')) return;
        if (identifier === 'preconditionCooldown') {
            const remaining = Reflect.get(Object(context), 'remaining');
            const ms = new _duration.DurationFormatter().format(remaining);
            return interaction.reply({
                content: `Slow down! You must wait **${ms}** before using the \`${interaction.commandName}\` comand.`,
                allowedMentions: {
                    users: [
                        interaction.user.id
                    ],
                    roles: []
                },
                ephemeral: true
            });
        }
        return interaction.reply({
            content,
            allowedMentions: {
                users: [
                    interaction.user.id
                ],
                roles: []
            },
            ephemeral: true
        });
    }
}
