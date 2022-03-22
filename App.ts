import { fetchYr, currentWeather, upcomingForecast } from './src/Yr.ts'
import { YrWeather } from './types/YrWeather.d.ts'
import { getConfig } from './src/Config.ts'

const coordinates = await getConfig().then((res) => res.coordinates)

const yrUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lng}`

const response: YrWeather = await fetchYr(yrUrl)

if (Deno.args && Deno.args.includes('-c')) {
  console.log(currentWeather(response))
} else if (Deno.args && Deno.args.includes('-f')) {
  console.table(upcomingForecast(response))
}
