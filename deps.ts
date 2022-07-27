export { format } from 'https://deno.land/std@0.128.0/datetime/mod.ts';
export { parse } from 'https://deno.land/std@0.145.0/flags/mod.ts';
export { printHelp } from 'https://deno.land/x/deno_cli_help@1.0.1/mod.ts';
export type { Options } from 'https://deno.land/x/deno_cli_help@1.0.1/mod.ts';
export { Command } from 'https://deno.land/x/cliffy@v0.24.2/command/mod.ts';

const HOME_PATH = Deno.env.get('HOME');
export const CONFIG_FILE_PATH = `${HOME_PATH}/.config/yr/config.json`;
