import { fetchYr, currentWeather, upcomingForecast } from './src/Yr.ts'
import { Data } from './types/Config.d.ts'
import { getConfig, CONFIG_FILE_PATH } from './src/Config.ts'
import { parse } from "https://deno.land/std@0.130.0/flags/mod.ts";

const data: Data = {
  config: await getConfig().then((res) => res),
}

const flags = parse(Deno.args, {
  boolean: ["help", "getConfig", "current", "forecast"],
  string: ["setConfig", "lat", "lng"],
  alias: { "current": ["c"], "forecast": ["f"], "help": ["h"] }
})

if (flags.help) {
  console.log("Wants help?", flags.help)
  console.log("--help, -h\t\tBrings up this menu\n--config [path?]\tReturns config or uses config if options is specified")
}

if (flags.config && flags.lat && flags.lng) {
  console.error("You cannot provide a config path, and coordinates. You can only provide one.")
}

if (flags.lat && flags.lng) {
  data.config = {
    coordinates: {
      lat: flags.lat,
      lng: flags.lng,
    }
  }
}

if (flags.config) {
  console.log("Setting config path", flags.config)
  data.config = await getConfig(flags.config).then((res) => res)
}

if (flags.getConfig) {
  console.log(`Config path: ${CONFIG_FILE_PATH}`)
  console.log(data.config)
}

if (data.config) {
  const coordinates = data.config.coordinates
  const yrUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lng}`
  
  data.response = await fetchYr(yrUrl)
}

if (flags.current && data.response) {
  console.log(currentWeather(data.response))
}

if (flags.forecast && data.response) {
  console.log(upcomingForecast(data.response))
}