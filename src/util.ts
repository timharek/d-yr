import { Nominatim } from './nominatim.ts';
import { Yr } from './yr.ts';
import { Colors } from '../deps.ts';

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
export async function getCurrentWeather(locationName: string) {
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
) {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse: Yr.IWeather = await _fetch(url);

  return await Yr.forecast(yrResponse, interval);
}

export function getWeatherMessage(input: CLI.ITimeseriesSimple) {
  return `${input.temperature} with ${input.wind_speed} wind and ${input.rain} rain.`;
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
