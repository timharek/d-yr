export { format } from 'https://deno.land/std@0.165.0/datetime/mod.ts';
export { parse } from 'https://deno.land/std@0.165.0/flags/mod.ts';
export { Command } from 'https://deno.land/x/cliffy@v0.24.2/command/mod.ts';
export { UpgradeCommand, GithubProvider } from "https://deno.land/x/cliffy@v0.25.4/command/upgrade/mod.ts";

const HOME_PATH = Deno.env.get('HOME');
export const CONFIG_FILE_PATH = `${HOME_PATH}/.config/yr/config.json`;
