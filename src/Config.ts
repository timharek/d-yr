import { Config } from '../types/Config.d.ts';

const HOME_PATH = Deno.env.get('HOME');
const CONFIG_FILE_PATH = `${HOME_PATH}/.config/yr/config.json`;

export async function getConfig(): Promise<Config> {
	try {
		return JSON.parse(await Deno.readTextFile(CONFIG_FILE_PATH));
	} catch (error) {
		console.error(error);
		return {
			coordinates: {
				lat: 60.389444,
				lng: 5.33,
			},
		};
	}
}
