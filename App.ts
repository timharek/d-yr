import { fetchYr, currentWeather, upcomingForecast } from './src/Yr.ts'
import { YrWeather } from './types/YrWeather.d.ts'
import { Config } from './types/Config.d.ts'

const HOME_PATH = Deno.env.get("HOME")
const CONFIG_FILE_PATH = `${HOME_PATH}/.config/yr/config.json`

// Bergen
const defaultCoordinates = {
  lat: 60.389444,
  lng: 5.33,
}

let config: Config = { coordinates: defaultCoordinates}

try {
  config = JSON.parse(await Deno.readTextFile(CONFIG_FILE_PATH).catch((err) => { console.error(err); return ''}))
} catch (error) {
  console.error(error)
  config = { coordinates: defaultCoordinates}
}

const coordinates = config.coordinates 

const yrUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lng}`

const response: YrWeather = await fetchYr(yrUrl)

if (Deno.args && Deno.args.includes('-c')) {
  console.log(currentWeather(response))
} else if (Deno.args && Deno.args.includes('-f')) {
  console.table(upcomingForecast(response))
}
