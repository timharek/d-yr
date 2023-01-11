// @deno-types='./mod.d.ts'
import { getCoordinatesFromName } from './src/nominatim.ts';
import { _fetch, currentWeather, getUrl, upcomingForecast } from './src/yr.ts';
import { Command, GithubProvider, UpgradeCommand } from './deps.ts';

const currentCmd = new Command()
  .description('Return current weather.')
  .action(async (options: Options, name: string) => {
    const { lat, lng } = await getCoordinatesFromName(name);
    const url = getUrl(lat, lng);

    const yrResponse: YrWeather = await _fetch(url);

    console.log(await currentWeather(yrResponse, options.verbose ?? 0));
  });

const forecastCmd = new Command()
  .description('Return forecast.')
  .action(async (options: Options, name: string, interval: number = 1) => {
    const { lat, lng } = await getCoordinatesFromName(name);
    const url = getUrl(lat, lng);

    const yrResponse: YrWeather = await _fetch(url);

    console.log(
      await upcomingForecast(
        yrResponse,
        interval,
        options.verbose ?? 0,
      ),
    );
  });

await new Command()
  .name('yr')
  .version('v1.2.1')
  .description('Get weather data from Yr using Deno.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://github.com/timharek/d-yr')
  .example('Current weather in Bergen', `yr current bergen`)
  .example('Forecast next 5 hours in Bergen', `yr forecast 5 bergen`)
  .globalOption('-v, --verbose', 'A more verbose output.', {
    collect: true,
    value: (value: boolean, previous: number = 0) => (value ? previous + 1 : 0),
  })
  .command('current <name:string>', currentCmd)
  .command(
    'forecast <name:string> [interval:number]',
    forecastCmd,
  )
  .command(
    'upgrade',
    new UpgradeCommand({
      main: 'mod.ts',
      args: ['--allow-net', '--allow-read', '--allow-env'],
      provider: [new GithubProvider({ repository: 'timharek/d-yr' })],
    }),
  )
  .parse(Deno.args);
