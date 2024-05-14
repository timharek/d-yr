/**
 * Access Yr's weather API and Nominatim's names API for getting weather details
 * about a specific location.
 *
 * ## Installation
 *
 * ```sh
 * deno install --allow-net=api.met.no,nominatim.openstreetmap.org \
 * -n yr jsr:@timharek/d-yr/cli
 * ```
 *
 * @module
 */

import config from '../deno.json' with { type: 'json' };
import { Command, CompletionsCommand } from '../deps.ts';
import {
  currentMessage,
  forecastMessage,
  todayMessage,
  tomorrowMessage,
} from './cli_messages.ts';
import { _fetch } from './util.ts';

const app = new Command()
  .name('yr')
  .version(`v${config.version}`)
  .description('Get weather data from Yr using Deno.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://jsr.io/@timharek/d-yr')
  .example('Current weather in Bergen', `yr current bergen`)
  .example('Forecast next 5 hours in Bergen', `yr forecast 5 bergen`)
  .globalOption('--json', 'Display JSON output.')
  .action(function (): void {
    this.showHelp();
  });

/**
 * Only relevant the CLI's options.
 * @private
 */
export type GlobalOptions = typeof app extends
  Command<void, void, void, [], infer Options extends Record<string, unknown>>
  ? Options
  : never;

const currentCmd = new Command<GlobalOptions>()
  .arguments('<name:string>')
  .description('Return current weather.')
  .action(currentMessage);

const forecastCmd = new Command<GlobalOptions>()
  .arguments('<name:string> [interval:number]')
  .description('Return forecast.')
  .action(forecastMessage);

const todayCmd = new Command<GlobalOptions>()
  .arguments('<name:string>')
  .description("Return today's forecast.")
  .action(todayMessage);

const tomorrowCmd = new Command<GlobalOptions>()
  .arguments('<name:string>')
  .description("Return tomorrow's forecast.")
  .action(tomorrowMessage);

if (import.meta.main) {
  await app
    .command('current', currentCmd)
    .command('forecast', forecastCmd)
    .command('today', todayCmd)
    .command('tomorrow', tomorrowCmd)
    .command('completions', new CompletionsCommand())
    .parse(Deno.args);
}
