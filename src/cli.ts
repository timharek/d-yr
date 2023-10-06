// @deno-types='../mod.d.ts'

import { Colors } from '../deps.ts';
import { Command } from '../deps.ts';
import {
  _fetch,
  getCurrentWeather,
  getForecastedWeather,
  getTodaysWeather,
  getTomorrowsWeather,
  getWeatherMessage,
} from './util.ts';

interface Options {
  json?: boolean;
  debug?: boolean;
}

const currentCmd = new Command()
  .description('Return current weather.')
  .action(async ({ json }: Options, name: string) => {
    const currentWeather = await getCurrentWeather(name);
    if (json) {
      console.log(JSON.stringify(currentWeather, null, 2));
      return;
    }
    console.log(
      `${Colors.bold(Colors.black(Colors.bgBlue(` ${name} now `)))}\n  ${
        getWeatherMessage(currentWeather)
      }`,
    );
  });

const forecastCmd = new Command()
  .description('Return forecast.')
  .action(async ({ json }: Options, name: string, interval = 1) => {
    // TODO: Add message format for non-JSON result
    console.log(
      await getForecastedWeather(name, interval),
    );
  });

const todayCmd = new Command()
  .description('Return today\'s forecast.')
  .action(async ({ json }: Options, name: string) => {
    // TODO: Add message format for non-JSON result
    console.log(
      await getTodaysWeather(name),
    );
  });

const tomorrowCmd = new Command()
  .description('Return tomorrow\'s forecast.')
  .action(async ({ json }: Options, name: string) => {
    // TODO: Add message format for non-JSON result
    console.log(
      await getTomorrowsWeather(name),
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
