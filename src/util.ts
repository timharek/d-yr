// @deno-types='../mod.d.ts'

import { Nominatim } from './nominatim.ts';
import { Yr } from './yr.ts';
import { Colors } from '../deps.ts';
import { WeatherSymbols } from './weather_symbols.ts';

/**
 * Shared fetch-function for simple GET-requests.
 *
 * @param url The URL to send GET-request to
 * @returns Result from GET-request.
 */
export async function _fetch(url: string | URL) {
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });

  return result;
}

/**
 * Get current weather.
 *
 * @param locationName Name of the location, can be village, city etc.
 *
 * @returns Current weather
 */
export async function getCurrentWeather(
  locationName: string,
): Promise<CLI.ITimeseriesSimple> {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse: Yr.IWeather = await _fetch(url);

  return await Yr.current(yrResponse);
}

/**
 * Get forcasted weather.
 *
 * @param locationName Name of the location, can be village, city etc.
 * @param interval Number of hours ahead of current time.
 *
 * @returns Forecasted weather
 */
export async function getForecastedWeather(
  locationName: string,
  interval = 1,
  jsonOutput = false,
) {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse: Yr.IWeather = await _fetch(url);

  return await Yr.forecast(yrResponse, interval, jsonOutput);
}

/**
 * Get today's weather.
 *
 * @param locationName Name of the location, can be village, city etc.
 *
 * @returns Forecasted weather
 */
export async function getTodaysWeather(
  locationName: string,
  jsonOutput = false,
) {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse: Yr.IWeather = await _fetch(url);
  const interval = getHoursLeftForTheDay();

  return await Yr.forecast(yrResponse, interval, jsonOutput);
}

/**
 * Get tomorrow's weather.
 *
 * @param locationName Name of the location, can be village, city etc.
 *
 * @returns Forecasted weather
 */
export async function getTomorrowsWeather(
  locationName: string,
  jsonOutput = false,
) {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse: Yr.IWeather = await _fetch(url);
  const filteredResponse = getTomorrowsWeatherResponse(yrResponse);

  return await Yr.forecast(filteredResponse, 24, jsonOutput);
}

function getTomorrowsWeatherResponse(input: Yr.IWeather): Yr.IWeather {
  const filteredTimeseries = input.properties.timeseries.filter((item) => {
    const itemDate = new Date(item.time);
    const tomorrow = getDayAfterDate(new Date());

    return itemDate.getDate() === tomorrow.getDate();
  });

  return {
    ...input,
    properties: {
      ...input.properties,
      timeseries: filteredTimeseries,
    },
  };
}

export function getHoursLeftForTheDay(): number {
  const date = new Date();
  return 24 - date.getHours();
}

export function getDayAfterDate(date: Date): Date {
  const tomorrow = new Date(date.setHours(25, 0, 0, 0));
  return tomorrow;
}

export function getWeatherMessage(input: CLI.ITimeseriesSimple) {
  return `${
    WeatherSymbols[input.symbol]
  }   ${input.temperature} with ${input.wind_speed} wind and ${input.rain} rain.`;
}

export function getForecastMessage(
  locationName: string,
  input: CLI.ITimeseriesSimple[],
) {
  const newArray = input.map((item) => {
    return `${
      Colors.bold(Colors.black(Colors.bgBlue(` ${item.datetime} `)))
    }\n  ${getWeatherMessage(item)}\n`;
  });
  return `${
    Colors.underline(
      `Forecast in ${locationName} for next ${newArray.length} hours`,
    )
  }\n\n${newArray.join('\n')}`;
}

/**
 * Removes undefined from arrays
 *
 * @param array Timeseries from parsed from Yr
 * @returns Array without any undefined entries
 */
export function cleanForecast(
  array: (CLI.ITimeseriesSimple | undefined)[],
): CLI.ITimeseriesSimple[] {
  return array.filter((entry) => entry != undefined) as CLI.ITimeseriesSimple[];
}

/**
 *  Get Yr.no's request URL with coordinates.
 *
 * @param lat Latitude
 * @param lng Longitude
 * @returns Yr.no's request URL
 */
export function getUrl(lat: number, lng: number): URL {
  const url = new URL(
    'https://api.met.no/weatherapi/locationforecast/2.0/compact',
  );
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lng.toString());

  return url;
}

export function getEarliestTimeseries(
  timeseriesArray: Yr.ITimeseries[],
): Yr.ITimeseries {
  return timeseriesArray.sort((a, b) =>
    new Date(a.time).getTime() -
    new Date(b.time).getTime()
  )[0];
}
