// @deno-types='../mod.d.ts'
import { format as formatDate } from '../deps.ts';
import { getNameFromCoordinates } from './nominatim.ts';

/**
 * Get the current weather as the hour closest from the time the request occured.
 *
 * @param weatherData Data from Yr.
 * @param verbose Verbosity level
 * @returns Current weather with based on `verbose`-level
 */
async function getCurrentWeather(
  weatherData: Yr.IWeather,
  verbose: number,
) {
  const {
    properties: { meta: { units }, timeseries },
    geometry: { coordinates },
  } = weatherData;
  const { data: { instant, next_1_hours: nextHour }, time: closestTime }:
    Yr.ITimeseries = getClosestTimeseries(timeseries);

  const lng = coordinates[0];
  const lat = coordinates[1];

  const result = {
    location_name: await getNameFromCoordinates(lat, lng),
    datetime: `${formatDate(new Date(closestTime), 'HH:mm')}`,
    symbol: nextHour.summary.symbol_code,
    wind_speed: `${instant.details.wind_speed} ${units.wind_speed}`,
    temperature: `${instant.details.air_temperature} ${
      units.air_temperature[0].toUpperCase()
    }`,
    wind_direction: instant.details.wind_from_direction,
    rain:
      `${nextHour.details.precipitation_amount} ${units.precipitation_amount}`,
  } as CLI.ITimeseriesSimple;

  return getVerboseMessage(result, verbose);
}

function getClosestTimeseries(
  timeseriesArray: Yr.ITimeseries[],
): Yr.ITimeseries {
  const now: Date = new Date();

  return timeseriesArray.reduce((a, b) =>
    new Date(a.time).getTime() - now.getTime() <
        new Date(b.time).getTime() - now.getTime()
      ? a
      : b
  );
}

/**
 * Get current upcoming forecast.
 *
 * @param weatherData Data from Yr.
 * @param interval Numer of requested hours of forecast
 * @param verbose Verbosity level
 *
 * @returns Upcoming forecast based on `interval`-level.
 */
async function getForecastUpcoming(
  weatherData: Yr.IWeather,
  interval: number,
  verbose: number,
) {
  const {
    properties: { meta: { units }, timeseries },
    geometry: { coordinates },
  } = weatherData;
  const { time: closestTime } = getClosestTimeseries(timeseries);

  const result = weatherData.properties.timeseries.map((entry) => {
    const { data: { instant, next_1_hours: nextHour }, time } = entry;
    if (time != closestTime && nextHour) {
      return {
        datetime: `${formatDate(new Date(time), 'yyyy-MM-dd HH:mm')}`,
        symbol: nextHour.summary.symbol_code,
        wind_speed: `${instant.details.wind_speed} ${units.wind_speed}`,
        wind_direction: instant.details.wind_from_direction,
        temperature: `${instant.details.air_temperature} ${
          units.air_temperature[0].toUpperCase()
        }`,
        rain:
          `${nextHour.details.precipitation_amount} ${units.precipitation_amount}`,
      } as CLI.ITimeseriesSimple;
    }
  });

  const lng = coordinates[0];
  const lat = coordinates[1];

  const array = interval
    ? cleanForecast(result).slice(0, interval)
    : cleanForecast(result);

  return {
    location_name: await getNameFromCoordinates(lat, lng),
    array: array.map((entry) => getVerboseMessage(entry, verbose)),
  };
}

function getVerboseMessage(timeseries: CLI.ITimeseriesSimple, verbose: number) {
  if (verbose === 1) {
    const result = {
      temperature: timeseries.temperature,
      rain: timeseries.rain,
      wind_speed: timeseries.wind_speed,
    };
    if (timeseries.location_name) {
      return {
        location_name: timeseries.location_name,
        ...result,
      };
    } else {
      return result;
    }
  } else if (verbose > 1) {
    return timeseries;
  } else {
    return `Weather in ${timeseries.location_name}: ${timeseries.temperature} with ${timeseries.wind_speed} and ${timeseries.rain}`;
  }
}

/**
 * Removes undefined from arrays
 */
function cleanForecast(input: Array<unknown>) {
  return input.filter((entry: unknown) => entry != undefined);
}

/**
 * @returns Yr.no's request URL
 */
function getUrl(lat: number, lng: number) {
  const yrUrl =
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lng}`;
  return yrUrl;
}

export const Yr = {
  current: getCurrentWeather,
  forecast: getForecastUpcoming,
  getUrl,
};
