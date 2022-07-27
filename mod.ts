// @deno-types='./mod.d.ts'
import { currentWeather, fetchYr, upcomingForecast } from './src/yr.ts';
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

  if (data.config) {
    const coordinates = data.config.coordinates;
    const yrUrl =
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lng}`;
    return yrUrl;
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
  .option('--lat <lat:number>', 'Location latitude.')
  .option('--lng <lng:number>', 'Location longitude.')
  .option('-c, --current [value:boolean]', 'Return current weather forecast.', {
    default: false,
  })
  .option(
    '-f, --forecast [value:boolean]',
    'Return upcoming weather forecast in a table.',
    { default: false },
  )
  .action(
    async (
      options,
    ) => {
      const url = getUrl(options.lat, options.lng);

      data.response = await fetchYr(url);

      if (options.current) {
        console.log(currentWeather(data.response));
      }
      if (options.forecast) {
        console.log(upcomingForecast(data.response));
      }
    },
  )
  .parse(Deno.args);
