import { AuricleClient } from './AuricleClient';
import './lib/setup';
import { config } from 'dotenv';
import data from './config/data.json'
const client = new AuricleClient();

const main = async () => {
	try {
		client.logger.info('Logging in...');
		return client.login(process.env.DISCORD_TOKEN);
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};
void main();
