import { Timeseries } from './Timeseries.d.ts'

export type YrWeather = {
  type: string
  geometry: {
    type: string
    coordinates: Array<number>
  }
  properties: {
    meta: {
      updated_at: Date
      units: {
        air_pressure_at_sea_level: string
        air_temperature: string
        cloud_area_fraction: string
        precipitation_amount: string
        relative_humidity: string
        wind_from_direction: string
        wind_speed: string
      }
    }
    timeseries: Array<Timeseries>
  }
}
