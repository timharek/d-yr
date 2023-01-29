// @deno-types='../mod.d.ts'
import { Command, GithubProvider, UpgradeCommand } from '../deps.ts';
import { _fetch, getCurrentWeather, getForecastedWeather } from './util.ts';

const currentCmd = new Command()
  .description('Return current weather.')
  .action(async (options: CLI.Options, name: string) => {
    console.log(await getCurrentWeather(name, options.verbose));
  });

const forecastCmd = new Command()
  .description('Return forecast.')
  .action(async (options: CLI.Options, name: string, interval: number = 1) => {
    console.log(await getForecastedWeather(name, interval, options.verbose));
  });

await new Command()
  .name('yr')
  .version('v1.3.3')
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
