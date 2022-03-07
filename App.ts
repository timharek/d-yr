import { fetchYr, currentWeather, upcomingForecast } from './src/index.ts'
import { YrWeather } from './types/YrWeather.d.ts'

// Bergen
const coordinates = {
  lat: 60.389444,
  lon: 5.33,
}

const yrUrl: string = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lon}`

const response: YrWeather = await fetchYr(yrUrl)

console.log(currentWeather(response))

console.table(upcomingForecast(response))

