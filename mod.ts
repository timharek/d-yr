/**
 * Access Yr's weather API and Nominatim's names API for getting weather details
 * about a specific location.
 *
 * ## Example for current weather
 *
 * ```ts
 * import { getCurrentWeather } from 'https://deno.land/x/dyr/mod.ts';
 *
 * const currentWeather = getCurrentWeather('Bergen');
 * // do what you need to do with the weather data.
 * ```
 *
 * ## Example for forecasted weather
 *
 * ```ts
 * import { getForecastedWeather } from 'https://deno.land/x/dyr/mod.ts';
 *
 * const location = 'Bergen';
 * const hoursAhead = 5;
 * const verboseLevel = 3;
 * const currentWeather = getForecastedWeather(location, hoursAhead, verboseLevel);
 * // do what you need to do with the weather data.
 * ```
 *
 * @module
 */

export { Nominatim } from './src/nominatim.ts';
export { Yr } from './src/yr.ts';
export { getCurrentWeather, getForecastedWeather } from './src/util.ts';
