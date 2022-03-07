import { format as formatDate } from 'https://deno.land/std@0.128.0/datetime/mod.ts'
import { Timeseries, TimeseriesSimple } from '../types/Timeseries.d.ts'
import { YrWeather } from '../types/YrWeather.d.ts'

export async function fetchYr(url: string) {
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error)
    })

  return result
}

export function currentWeather(weatherData: YrWeather) {
  const units = weatherData.properties.meta.units
  const closestTimeseries: Timeseries = getClosestTimeseries(
    weatherData.properties.timeseries
  )

  return {
    datetime: `${closestTimeseries.time}`,
    symbol: closestTimeseries.data.next_1_hours.summary.symbol_code,
    wind_speed: `${closestTimeseries.data.instant.details.wind_speed} ${units.wind_speed}`,
    temperature: `${
      closestTimeseries.data.instant.details.air_temperature
    } ${units.air_temperature[0].toUpperCase()}`,
    wind_direction: closestTimeseries.data.instant.details.wind_from_direction,
    rain: `${closestTimeseries.data.next_1_hours.details.precipitation_amount} ${units.precipitation_amount}`,
  } as TimeseriesSimple
}

export function getClosestTimeseries(
  timeseriesArray: Timeseries[]
): Timeseries {
  const now: Date = new Date()

  return timeseriesArray.reduce((a: Timeseries, b: Timeseries) =>
    new Date(a.time).getTime() - now.getTime() <
    new Date(b.time).getTime() - now.getTime()
      ? a
      : b
  )
}

export function upcomingForecast(
  weatherData: YrWeather
): Array<TimeseriesSimple | undefined> {
  const units = weatherData.properties.meta.units
  const closest = getClosestTimeseries(weatherData.properties.timeseries)

  const result = weatherData.properties.timeseries.map((entry) => {
    if (entry.time != closest.time && entry?.data?.next_1_hours) {
      return {
        datetime: `${formatDate(new Date(entry.time), 'yyyy-MM-dd HH:mm')}`,
        symbol: entry.data.next_1_hours.summary.symbol_code,
        wind_speed: `${entry.data.instant.details.wind_speed} ${units.wind_speed}`,
        wind_direction: entry.data.instant.details.wind_from_direction,
        temperature: `${
          entry.data.instant.details.air_temperature
        } ${units.air_temperature[0].toUpperCase()}`,
        rain: `${entry.data.next_1_hours.details.precipitation_amount} ${units.precipitation_amount}`,
      } as TimeseriesSimple
    }
  })

  return cleanForecast(result)
}

/**
 * Removes undefined from arrays
 */
// deno-lint-ignore no-explicit-any
function cleanForecast(input: Array<any>) {
  // deno-lint-ignore no-explicit-any
  return input.filter((entry: any) => entry != undefined)
}
