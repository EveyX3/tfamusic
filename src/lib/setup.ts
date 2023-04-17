import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-logger/register';
import { setup, type ArrayString, EnvNumber } from '@skyra/env-utilities';
import { join } from 'path';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

const rootDir = join(__dirname, '..', '..');
setup({ path: join('.env') });

declare module '@skyra/env-utilities' {
	interface Env {
		OWNERS: ArrayString,
		DISCORD_TOKEN: ArrayString
	}
}
