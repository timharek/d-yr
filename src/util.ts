import { Nominatim } from './nominatim.ts';
import { Forecast, Yr } from './yr.ts';

/**
 * Shared fetch-function for simple GET-requests.
 *
 * @param url The URL to send GET-request to
 * @returns Result from GET-request.
 */
export async function _fetch<T>(url: string | URL): Promise<T> {
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
export async function getCurrent(
  locationName: string,
): Promise<CLI.ITimeseriesSimple> {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse = await _fetch<Yr.IWeather>(url);

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
export async function getForecast(
  locationName: string,
  interval = 1,
): Promise<Forecast> {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse = await _fetch<Yr.IWeather>(url);

  return await Yr.forecast(yrResponse, interval);
}

/**
 * Get tomorrow's weather.
 *
 * @param locationName Name of the location, can be village, city etc.
 *
 * @returns Forecasted weather
 */
export async function getTomorrow(
  locationName: string,
): Promise<Forecast> {
  const { lat, lng } = await Nominatim.getCoordinatesFromName(locationName);
  const url = Yr.getUrl(lat, lng);

  const yrResponse: Yr.IWeather = await _fetch(url);
  const filteredResponse = getTomorrowResponse(yrResponse);

  return await Yr.forecast(filteredResponse, 24);
}

function getTomorrowResponse(input: Yr.IWeather): Yr.IWeather {
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
