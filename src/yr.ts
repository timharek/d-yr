// @deno-types='../mod.d.ts'

import { format as formatDate } from '../deps.ts';
import { Nominatim } from './nominatim.ts';
import { getForecastMessage, getWeatherMessage } from './util.ts';

/**
 * Get the current weather as the hour closest from the time the request occured.
 *
 * @param weatherData Data from Yr.
 * @param verbose Verbosity level
 * @returns Current weather with based on `verbose`-level
 */
async function getCurrentWeather(
  weatherData: Yr.IWeather,
  jsonOutput = true,
) {
  const { units, timeseries, coordinates } = getPropertiesFromWeatherData(
    weatherData,
  );
  const earliestTimeseries: Yr.ITimeseries = getEarliestTimeseries(timeseries);
  const { instant, nextHour, closestTime } = getPropertiesFromTimeseries(
    earliestTimeseries,
  );

  const result = {
    location_name: await Nominatim.getNameFromCoordinates(coordinates),
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

  if (jsonOutput) {
    return result;
  }

  return getWeatherMessage(result);
}

function getPropertiesFromWeatherData(weatherData: Yr.IWeather) {
  return {
    units: weatherData.properties.meta.units,
    timeseries: weatherData.properties.timeseries,
    coordinates: {
      lng: weatherData.geometry.coordinates[0],
      lat: weatherData.geometry.coordinates[1],
    },
  };
}

function getPropertiesFromTimeseries(timeseries: Yr.ITimeseries) {
  return {
    instant: timeseries.data.instant,
    nextHour: timeseries.data.next_1_hours,
    closestTime: timeseries.time,
  };
}

function getEarliestTimeseries(
  timeseriesArray: Yr.ITimeseries[],
): Yr.ITimeseries {
  return timeseriesArray.sort((a, b) =>
    new Date(a.time).getTime() -
    new Date(b.time).getTime()
  )[0];
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
  jsonOutput = true,
) {
  const { units, timeseries, coordinates } = getPropertiesFromWeatherData(
    weatherData,
  );
  const { time: closestTime } = getEarliestTimeseries(timeseries);
  const location_name = await Nominatim.getNameFromCoordinates(coordinates);

  const resultArray = weatherData.properties.timeseries.map((entry) => {
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

  const array = interval
    ? cleanForecast(resultArray).slice(0, interval)
    : cleanForecast(resultArray);

  if (jsonOutput) {
    return {
      location_name,
      array,
    };
  }

  return getForecastMessage(location_name, array);
}

/**
 * Removes undefined from arrays
 *
 * @param array Timeseries from parsed from Yr
 * @returns Array without any undefined entries
 */
function cleanForecast(
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
function getUrl(lat: number, lng: number): URL {
  const url = new URL(
    'https://api.met.no/weatherapi/locationforecast/2.0/compact',
  );
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lng.toString());

  return url;
}

export const Yr = {
  current: getCurrentWeather,
  forecast: getForecastUpcoming,
  getUrl,
};

export const YrForTesting = {
  getEarliestTimeseries,
  cleanForecast,
  getUrl,
};
