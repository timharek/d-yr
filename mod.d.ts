declare namespace Yr {
  interface IWeather {
    type: string;
    geometry: {
      type: string;
      coordinates: Array<number>;
    };
    properties: {
      meta: {
        updated_at: Date;
        units: IUnits;
      };
      timeseries: Array<ITimeseries>;
    };
  }

  interface IUnits {
    air_pressure_at_sea_level: string;
    air_temperature: string;
    cloud_area_fraction: string;
    precipitation_amount: string;
    relative_humidity: string;
    wind_from_direction: string;
    wind_speed: string;
  }

  interface ITimeseries {
    time: string;
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: number;
          air_temperature: number;
          cloud_area_fraction: number;
          relative_humidity: number;
          wind_from_direction: number;
          wind_speed: number;
        };
      };
      next_12_hours: INextHour;
      next_1_hours: Required<INextHour>;
      next_6_hours: Required<INextHour>;
    };
  }

  interface INextHour {
    summary: {
      symbol_code: string;
    };
    details?: {
      precipitation_amount: number;
    };
  }

  interface IWeatherSymbols {
    [key: string]: string;
  }
}

declare interface Coordinates {
  lng: number;
  lat: number;
}
