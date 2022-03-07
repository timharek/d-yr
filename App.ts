import { fetchYr, currentWeather, upcomingForecast } from './src/index.ts'
import { YrWeather } from './types/YrWeather.d.ts'

// Bergen
const coordinates = {
  lat: 60.389444,
  lon: 5.33,
}

const yrUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lon}`

const response: YrWeather = await fetchYr(yrUrl)

if (Deno.args && Deno.args.includes('-c')) {
  console.log(currentWeather(response))
} else if (Deno.args && Deno.args.includes('-f')) {
  console.table(upcomingForecast(response))
}
