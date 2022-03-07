export type Timeseries = {
  time: Date
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number
        air_temperature: number
        cloud_area_fraction: number
        relative_humidity: number
        wind_from_direction: number
        wind_speed: number
      }
    }
    next_12_hours: {
      summary: {
        symbol_code: string
      }
    }
    next_1_hours: {
      summary: {
        symbol_code: string
      }
      details: {
        precipitation_amount: number
      }
    }
    next_6_hours: {
      summary: {
        symbol_code: string
      }
      details: {
        precipitation_amount: number
      }
    }
  }
}

export type TimeseriesSimple = {
  datetime: Date
  symbol: string
  wind_speed: number
  temperature: number
  wind_direction: number
}
