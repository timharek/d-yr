// @deno-types='../mod.d.ts'
import { CONFIG_FILE_PATH } from '../deps.ts';

export async function getConfig(customPath?: string): Promise<Config> {
  try {
    return JSON.parse(await Deno.readTextFile(customPath ?? CONFIG_FILE_PATH));
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
