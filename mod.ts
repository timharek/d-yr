// @deno-types='./mod.d.ts'
import { getCoordinatesFromName } from './src/nominatim.ts';
import { _fetch, currentWeather, upcomingForecast } from './src/yr.ts';
import { getConfig } from './src/config.ts';
import { Command } from './deps.ts';

const data: Data = {
  config: await getConfig().then((res) => res),
};

function getUrl(lat?: number, lng?: number) {
  if (lat && lng) {
    data.config = {
      coordinates: {
        lat: Number(lat),
        lng: Number(lng),
      },
    };
  }

  if (!data.config) {
    return null;
  }
  const coordinates = data.config.coordinates;
  const yrUrl =
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lng}`;
  return yrUrl;
}

async function getResponse(options, name: string) {
  if (name) {
    const coordinatesFromName = await getCoordinatesFromName(name);
    options.lat = coordinatesFromName.lat;
    options.lng = coordinatesFromName.lng;
  }

  const url = getUrl(options.lat, options.lng);

  if (url) {
    data.response = await _fetch(url);
  }
}

await new Command()
  .name('yr')
  .version('1.1.0')
  .description('Get weather data from Yr using Deno.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://github.com/timharek/d-yr')
  .example(
    '',
    ``,
  )
  .globalOption('-v, --verbose [value:boolean]', 'A more verbose output.', {
    default: false,
  })
  .globalOption('--lat <lat:number>', 'Location latitude.')
  .globalOption('--lng <lng:number>', 'Location longitude.')
  .command('current [name:string]', 'Return current weather forecast.')
  .action(
    async (
      options,
      name,
    ) => {
      await getResponse(options, name);

      if (data.response) {
        console.log(await currentWeather(data.response));
      }
    },
  )
  .command('forecast [name:string]', 'Return current weather forecast.')
  .action(
    async (
      options,
      name,
    ) => {
      await getResponse(options, name);

      if (data.response) {
        console.log(await upcomingForecast(data.response));
      }
    },
  )
  .parse(Deno.args);
