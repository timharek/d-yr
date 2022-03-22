import { Config } from '../types/Config.d.ts';

const HOME_PATH = Deno.env.get('HOME');
const CONFIG_FILE_PATH = `${HOME_PATH}/.config/yr/config.json`;

export async function getConfig(): Promise<Config> {
	try {
		return JSON.parse(await Deno.readTextFile(CONFIG_FILE_PATH));
	} catch (error) {
		console.error(error);
		console.warn('No config is present.');
		const wantsNewConfig = confirm('Do you me to create one?');
		if (wantsNewConfig) {
			const lat = prompt('What is the latitude for your coordinates?');
			const lng = prompt('What is the longitude for your coordinates?');

			return generateConfigFile(lat, lng);
		}

		throw new Error('Missing config file');
	}
}

async function generateConfigFile(
	lat: string | null,
	lng: string | null,
): Promise<Config> {
	const config: Config = {
		coordinates: {
			lat: Number(lat),
			lng: Number(lng),
		},
	};

	await Deno.writeTextFileSync(CONFIG_FILE_PATH, JSON.stringify(config));

	return config;
}
