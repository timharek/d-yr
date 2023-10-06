// @deno-types='../mod.d.ts'

import { Colors, format as formatDate } from '../deps.ts';
import { Nominatim } from './nominatim.ts';
import {
  cleanForecast,
  getEarliestTimeseries,
  getForecastMessage,
  getUrl,
  getWeatherMessage,
} from './util.ts';

/**
 * Get the current weather as the hour closest from the time the request occured.
 *
 * @param weatherData Data from Yr.
 * @param verbose Verbosity level
 * @returns Current weather with based on `verbose`-level
 */
async function getCurrentWeather(
  weatherData: Yr.IWeather,
): Promise<CLI.ITimeseriesSimple> {
  const { units, timeseries, coordinates } = getPropertiesFromWeatherData(
    weatherData,
  );
  const earliestTimeseries: Yr.ITimeseries = getEarliestTimeseries(timeseries);
  const location_name = await Nominatim.getNameFromCoordinates(coordinates);

  return {
    location_name,
    ...getSimpleTimeseries(earliestTimeseries, units),
  } as CLI.ITimeseriesSimple;
}

interface WeatherDataProps {
  units: Yr.IUnits;
  timeseries: Yr.ITimeseries[];
  coordinates: {
    lng: number;
    lat: number;
  };
}

function getPropertiesFromWeatherData(
  weatherData: Yr.IWeather,
): WeatherDataProps {
  return {
    units: weatherData.properties.meta.units,
    timeseries: weatherData.properties.timeseries,
    coordinates: {
      lng: weatherData.geometry.coordinates[0],
      lat: weatherData.geometry.coordinates[1],
    },
  };
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
): Promise<
  CLI.ITimeseriesSimple | string | {
    location_name: string;
    array: CLI.ITimeseriesSimple[];
  }
> {
  const { units, timeseries, coordinates } = getPropertiesFromWeatherData(
    weatherData,
  );
  const { time: closestTime } = getEarliestTimeseries(timeseries);
  const location_name = await Nominatim.getNameFromCoordinates(coordinates);

  const resultArray = weatherData.properties.timeseries.map((entry) => {
    const { data: { next_1_hours: nextHour }, time } = entry;
    if (time != closestTime && nextHour) {
      return getSimpleTimeseries(entry, units);
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

function getSimpleTimeseries(
  timeseries: Yr.ITimeseries,
  units: Yr.IUnits,
): CLI.ITimeseriesSimple {
  const { data: { instant, next_1_hours: nextHour }, time } = timeseries;
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

export const Yr = {
  current: getCurrentWeather,
  forecast: getForecastUpcoming,
  getUrl,
};
