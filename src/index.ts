import { Timeseries, TimeseriesSimple } from "../types/Timeseries.d.ts"
import { YrWeather } from "../types/YrWeather.d.ts"

export async function fetchYr(url: string) {
  const result = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error)
    })

  return result
}

export function currentWeather(weatherData: YrWeather) {
  const closestTimeseries: Timeseries = getClosestTimeseries(
    weatherData.properties.timeseries
  )

  return {
    datetime: closestTimeseries.time,
    symbol: closestTimeseries.data.next_1_hours.summary.symbol_code,
    wind_speed: closestTimeseries.data.instant.details.wind_speed,
    temperature: closestTimeseries.data.instant.details.air_temperature,
    wind_direction: closestTimeseries.data.instant.details.wind_from_direction,
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
  const closest = getClosestTimeseries(weatherData.properties.timeseries)

  const result = weatherData.properties.timeseries.map((entry) => {
    if (entry.time != closest.time && entry?.data?.next_1_hours) {
      return {
        datetime: entry.time,
        symbol: entry.data.next_1_hours.summary.symbol_code,
        wind_speed: entry.data.instant.details.wind_speed,
        wind_direction: entry.data.instant.details.wind_from_direction,
        temperature: entry.data.instant.details.air_temperature,
      } as TimeseriesSimple
    }
  })

  return cleanForecast(result)
}

function cleanForecast(input: any) {
  return input.filter((entry: any) => entry != undefined)
}
