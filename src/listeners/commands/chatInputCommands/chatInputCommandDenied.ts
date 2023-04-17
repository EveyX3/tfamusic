import { DurationFormatter } from '@sapphire/duration';
import type { ChatInputCommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public run({ identifier, context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		if (identifier === 'preconditionCooldown') {
			const remaining = Reflect.get(Object(context), 'remaining');
			const ms = new DurationFormatter().format(remaining);
			return interaction.reply({
				embeds: [{
					description: `Slow down! You must wait **${ms}** to use ${interaction.commandName} again!`
				}],
				allowedMentions: { users: [interaction.user.id], roles: [] },
				ephemeral: true
			});
		}

		return interaction.reply({
			content,
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: true
		});
	}
}
