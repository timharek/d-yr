// @deno-types='../mod.d.ts'
import { format as formatDate } from '../deps.ts';
import { getNameFromCoordinates } from './nominatim.ts';

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

export async function currentWeather(weatherData: YrWeather) {
  const units = weatherData.properties.meta.units;
  const closestTimeseries: Timeseries = getClosestTimeseries(
    weatherData.properties.timeseries,
  );

  const result = {
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
  } as TimeseriesSimple;

  const lng = weatherData.geometry.coordinates[0];
  const lat = weatherData.geometry.coordinates[1];

  return {
    location_name: await getNameFromCoordinates(lat, lng),
    ...result,
  };
}

export function getClosestTimeseries(
  timeseriesArray: Timeseries[],
): Timeseries {
  const now: Date = new Date();

  return timeseriesArray.reduce((a: Timeseries, b: Timeseries) =>
    new Date(a.time).getTime() - now.getTime() <
        new Date(b.time).getTime() - now.getTime()
      ? a
      : b
  );
}

export async function upcomingForecast(
  weatherData: YrWeather,
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
      } as TimeseriesSimple;
    }
  });

  const lng = weatherData.geometry.coordinates[0];
  const lat = weatherData.geometry.coordinates[1];

  return {
    location_name: await getNameFromCoordinates(lat, lng),
    array: cleanForecast(result),
  };
}

/**
 * Removes undefined from arrays
 */
// deno-lint-ignore no-explicit-any
function cleanForecast(input: Array<any>) {
  // deno-lint-ignore no-explicit-any
  return input.filter((entry: any) => entry != undefined);
}
