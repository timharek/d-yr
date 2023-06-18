// @deno-types='../mod.d.ts'

import { Command } from '../deps.ts';
import {
  _fetch,
  getCurrentWeather,
  getForecastedWeather,
  getTodaysWeather,
  getTomorrowsWeather,
} from './util.ts';

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

const todayCmd = new Command()
  .description('Return today\'s forecast.')
  .action(async (options: unknown, name: string) => {
    console.log(
      await getTodaysWeather(name, options.json as boolean),
    );
  });

const tomorrowCmd = new Command()
  .description('Return tomorrow\'s forecast.')
  .action(async (options: unknown, name: string) => {
    console.log(
      await getTomorrowsWeather(name, options.json as boolean),
    );
  });

await new Command()
  .name('yr')
  .version('v1.5.0')
  .description('Get weather data from Yr using Deno.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://github.com/timharek/d-yr')
  .example('Current weather in Bergen', `yr current bergen`)
  .example('Forecast next 5 hours in Bergen', `yr forecast 5 bergen`)
  .globalOption('-d, --debug', 'Show debugging output.')
  .globalOption('--json', 'Display JSON output.')
  .command('current <name:string>', currentCmd)
  .command(
    'forecast <name:string> [interval:number]',
    forecastCmd,
  )
  .command('today <name:string>', todayCmd)
  .command('tomorrow <name:string>', tomorrowCmd)
  .parse(Deno.args);
