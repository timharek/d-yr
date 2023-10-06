import { Command } from '../deps.ts';
import {
  currentMessage,
  forecastMessage,
  todayMessage,
  tomorrowMessage,
} from './cli_messages.ts';
import { _fetch } from './util.ts';

export interface Options {
  json?: boolean;
}

const currentCmd = new Command()
  .description('Return current weather.')
  .action(currentMessage);

const forecastCmd = new Command()
  .description('Return forecast.')
  .action(forecastMessage);

const todayCmd = new Command()
  .description('Return today\'s forecast.')
  .action(todayMessage);

const tomorrowCmd = new Command()
  .description('Return tomorrow\'s forecast.')
  .action(tomorrowMessage);

await new Command()
  .name('yr')
  .version('v1.5.0')
  .description('Get weather data from Yr using Deno.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://deno.land/x/dyr')
  .example('Current weather in Bergen', `yr current bergen`)
  .example('Forecast next 5 hours in Bergen', `yr forecast 5 bergen`)
  .globalOption('--json', 'Display JSON output.')
  .action(function (): void {
    this.showHelp();
  })
  .command('current <name:string>', currentCmd)
  .command(
    'forecast <name:string> [interval:number]',
    forecastCmd,
  )
  .command('today <name:string>', todayCmd)
  .command('tomorrow <name:string>', tomorrowCmd)
  .parse(Deno.args);
