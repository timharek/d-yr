// @deno-types='../mod.d.ts'

import { Command, GithubProvider, UpgradeCommand } from '../deps.ts';
import { _fetch, getCurrentWeather, getForecastedWeather } from './util.ts';

const currentCmd = new Command()
  .description('Return current weather.')
  .action(async (options: unknown, name: string) => {
    console.log(await getCurrentWeather(name, options.json as boolean));
  });

const forecastCmd = new Command()
  .description('Return forecast.')
  .action(async (options: unknown, name: string, interval = 1) => {
    console.log(
      await getForecastedWeather(name, interval, options.json as boolean),
    );
  });

await new Command()
  .name('yr')
  .version('v1.4.0')
  .description('Get weather data from Yr using Deno.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://github.com/timharek/d-yr')
  .example('Current weather in Bergen', `yr current bergen`)
  .example('Forecast next 5 hours in Bergen', `yr forecast 5 bergen`)
  .globalOption('-d, --debug', 'Show debugging output.')
  .globalOption('--json', 'Display JSON output.', { default: false })
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
