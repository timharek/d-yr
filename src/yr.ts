// @deno-types='../mod.d.ts'
import { format as formatDate } from '../deps.ts';
import { Nominatim } from './nominatim.ts';

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
    Yr.ITimeseries = getEarliestTimeseries(timeseries);

  const lng = coordinates[0];
  const lat = coordinates[1];

  const result = {
    location_name: await Nominatim.getNameFromCoordinates(lat, lng),
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
  verbose: number,
) {
  const {
    properties: { meta: { units }, timeseries },
    geometry: { coordinates },
  } = weatherData;
  const { time: closestTime } = getEarliestTimeseries(timeseries);

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
    location_name: await Nominatim.getNameFromCoordinates(lat, lng),
    array: array.map((entry) => getVerboseMessage(entry, verbose, 'forecast')),
  };
}

/**
 * Get verbose message based on verbosity level.
 *
 * @param timeseries A parsed timeseries from Yr
 * @param verbose Verbosity level
 * @returns `verbose == 0` = string, `verbose == 1` = `{ location_name, temperature, rain, wind_speed }` and `verbose > 1` = `CLI.ITimeseriesSimple`
 */
function getVerboseMessage(
  timeseries: CLI.ITimeseriesSimple,
  verbose: number,
  type: 'current' | 'forecast' = 'current',
) {
  const { location_name, datetime, temperature, rain, wind_speed } = timeseries;
  if (verbose > 1) {
    return timeseries;
  }
  if (verbose === 1) {
    return {
      ...(type === 'forecast' && { time: datetime.split(' ')[1] }),
      ...(location_name &&
        { location_name }),
      temperature,
      rain,
      wind_speed,
    };
  }

  if (type === 'forecast') {
    const time = datetime.split(' ')[1];
    return `${time}: ${temperature} with ${wind_speed} and ${rain}`;
  }
  return `Current weather in ${location_name}: ${temperature} with ${wind_speed} and ${rain}`;
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

export const YrForTesting = {
  getEarliestTimeseries,
  cleanForecast,
};
