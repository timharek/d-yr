// @deno-types='../mod.d.ts'
import { format as formatDate } from '../deps.ts';
import { getNameFromCoordinates } from './nominatim.ts';

async function getCurrentWeather(
  weatherData: Yr.IWeather,
  verbose: number,
) {
  const units = weatherData.properties.meta.units;
  const closestTimeseries: Yr.ITimeseries = getClosestTimeseries(
    weatherData.properties.timeseries,
  );

  const lng = weatherData.geometry.coordinates[0];
  const lat = weatherData.geometry.coordinates[1];

  const result = {
    location_name: await getNameFromCoordinates(lat, lng),
    datetime: `${formatDate(new Date(closestTimeseries.time), 'HH:mm')}`,
    symbol: closestTimeseries.data.next_1_hours.summary.symbol_code,
    wind_speed:
      `${closestTimeseries.data.instant.details.wind_speed} ${units.wind_speed}`,
    temperature: `${closestTimeseries.data.instant.details.air_temperature} ${
      units.air_temperature[0].toUpperCase()
    }`,
    wind_direction: closestTimeseries.data.instant.details.wind_from_direction,
    rain:
      `${closestTimeseries.data.next_1_hours.details.precipitation_amount} ${units.precipitation_amount}`,
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

async function getForecastUpcoming(
  weatherData: Yr.IWeather,
  interval: number,
  verbose: number,
) {
  const units = weatherData.properties.meta.units;
  const closest = getClosestTimeseries(weatherData.properties.timeseries);

  const result = weatherData.properties.timeseries.map((entry) => {
    if (entry.time != closest.time && entry?.data?.next_1_hours) {
      return {
        datetime: `${formatDate(new Date(entry.time), 'yyyy-MM-dd HH:mm')}`,
        symbol: entry.data.next_1_hours.summary.symbol_code,
        wind_speed:
          `${entry.data.instant.details.wind_speed} ${units.wind_speed}`,
        wind_direction: entry.data.instant.details.wind_from_direction,
        temperature: `${entry.data.instant.details.air_temperature} ${
          units.air_temperature[0].toUpperCase()
        }`,
        rain:
          `${entry.data.next_1_hours.details.precipitation_amount} ${units.precipitation_amount}`,
      } as CLI.ITimeseriesSimple;
    }
  });

  const lng = weatherData.geometry.coordinates[0];
  const lat = weatherData.geometry.coordinates[1];

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

export function getUrl(lat: number, lng: number) {
  const yrUrl =
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lng}`;
  return yrUrl;
}

export const Yr = {
  current: getCurrentWeather,
  forecast: getForecastUpcoming,
  getUrl,
}
