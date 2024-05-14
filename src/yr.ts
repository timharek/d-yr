import { format as formatDate, locationFromCoordinates } from '../deps.ts';
import { cleanForecast, getEarliestTimeseries, getUrl } from './util.ts';

export interface TimeseriesMinified {
  location_name?: string;
  datetime: string;
  symbol: string;
  wind_speed: string;
  temperature: string;
  wind_direction: number;
  rain: string;
}

/**
 * Get the current weather as the hour closest from the time the request occured.
 *
 * @param weatherData Data from Yr.
 * @param verbose Verbosity level
 * @returns Current weather with based on `verbose`-level
 */
async function getCurrent(
  weatherData: Yr.IWeather,
): Promise<TimeseriesMinified> {
  const { units, timeseries, coordinates } = getProperties(
    weatherData,
  );
  const earliestTimeseries: Yr.ITimeseries = getEarliestTimeseries(timeseries);
  const location = await locationFromCoordinates(coordinates);
  const locationName = location?.city ?? location?.village;

  return {
    location_name: locationName,
    ...getSimpleTimeseries(earliestTimeseries, units),
  } as TimeseriesMinified;
}

interface WeatherDataProps {
  units: Yr.IUnits;
  timeseries: Yr.ITimeseries[];
  coordinates: {
    lng: number;
    lat: number;
  };
}

function getProperties(
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

export interface Forecast {
  location_name: string;
  array: TimeseriesMinified[];
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
async function getForecast(
  weatherData: Yr.IWeather,
  interval: number,
): Promise<Forecast> {
  const { units, timeseries, coordinates } = getProperties(
    weatherData,
  );
  const { time: closestTime } = getEarliestTimeseries(timeseries);
  const location = await locationFromCoordinates(coordinates);
  const locationName = location?.city ?? location?.village;

  const resultArray = weatherData.properties.timeseries.map((entry) => {
    const { data: { next_1_hours: nextHour }, time } = entry;
    if (time != closestTime && nextHour) {
      return getSimpleTimeseries(entry, units);
    }
  });

  const array = interval
    ? cleanForecast(resultArray).slice(0, interval)
    : cleanForecast(resultArray);

  return {
    location_name: locationName ?? '',
    array,
  };
}

function getSimpleTimeseries(
  timeseries: Yr.ITimeseries,
  units: Yr.IUnits,
): TimeseriesMinified {
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
  };
}

export const Yr = {
  current: getCurrent,
  forecast: getForecast,
  getUrl,
};
