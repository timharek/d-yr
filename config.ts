import { Config } from './types.d.ts';
import { Options, parse } from './deps.ts';

const HOME_PATH = Deno.env.get('HOME');
export const CONFIG_FILE_PATH = `${HOME_PATH}/.config/yr/config.json`;

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

export const CONFIG: Options = {
  name: 'yr',
  version: '1.0.1',
  description: 'Get weather data from Yr using Deno.',
  author: [{ name: 'Tim Hårek Andreassen', email: 'tim@harek.no' }],
  source: 'https://github.com/timharek/d-yr',
  flags: [
    {
      name: 'version',
      aliases: ['V'],
      description: 'Prints version.',
    },
    {
      name: 'help',
      aliases: ['h'],
      description: 'Prints this help message.',
    },
    {
      name: 'current',
      aliases: ['c'],
      description: 'Return the current weather forecast.',
    },
    {
      name: 'forecast',
      aliases: ['l'],
      description: 'Return the forecast in a table.',
    },
    {
      name: 'getConfig',
      description: 'Return the contents of the config-file.',
    },
    {
      name: 'lat',
      description:
        'Latitude, used in conjuction with longitude (--lng) in order to get forecast for a location not specified in your config.',
    },
    {
      name: 'lng',
      description:
        'Longitude, used in conjuction with latitude (--lat) in order to get forecast for a location not specified in your config.',
    },
  ],
  examples: [
    'yr -c',
    'yr -f',
    'yr --lat 5.33 --lng 5.33',
  ],
};

export const FLAGS = parse(Deno.args, {
  boolean: ['help', 'getConfig', 'current', 'forecast'],
  string: ['lat', 'lng'],
  alias: { 'current': ['c'], 'forecast': ['f'], 'help': ['h'] },
});
