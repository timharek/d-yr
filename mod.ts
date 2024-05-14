/**
 * Access Yr's weather API for getting weather forecast about a specific location.
 *
 * ## Example for current weather
 *
 * ```ts
 * import { getCurrent } from 'https://deno.land/x/dyr/mod.ts';
 *
 * const currentWeather = getCurrent('Bergen');
 * // do what you need to do with the weather data.
 * ```
 *
 * ## Example for forecasted weather
 *
 * ```ts
 * import { getForecast } from 'https://deno.land/x/dyr/mod.ts';
 *
 * const location = 'Bergen';
 * const hoursAhead = 5;
 *
 * const currentWeather = getForecast(location, hoursAhead);
 * ```
 *
 * @module
 */

export { Yr } from './src/yr.ts';
export { getCurrent, getForecast } from './src/util.ts';
