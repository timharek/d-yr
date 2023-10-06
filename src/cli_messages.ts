import { Colors } from '../deps.ts';
import { Options } from './cli.ts';
import {
  getCurrent,
  getForecast,
  getHoursLeftForTheDay,
  getTomorrow,
} from './util.ts';
import { WeatherSymbols } from './weather_symbols.ts';
import { Forecast, TimeseriesMinified } from './yr.ts';

function parseWeather(input: TimeseriesMinified): string {
  return `${
    WeatherSymbols[input.symbol]
  }   ${input.temperature} with ${input.wind_speed} wind and ${input.rain} rain.`;
}

export async function currentMessage(
  { json }: Options,
  name: string,
): Promise<void> {
  const currentWeather = await getCurrent(name);
  if (json) {
    console.log(JSON.stringify(currentWeather, null, 2));
    return;
  }
  console.log(
    `${Colors.bold(Colors.black(Colors.bgBlue(` ${name} now `)))}\n  ${
      parseWeather(currentWeather)
    }`,
  );
}

export async function forecastMessage(
  { json }: Options,
  name: string,
  interval = 1,
): Promise<void> {
  const forecast = await getForecast(name, interval);
  _forecastMessage({ json }, name, forecast);
}

function _forecastMessage(
  { json }: Options,
  name: string,
  forecast: Forecast,
): void {
  if (json) {
    console.log(JSON.stringify(forecast, null, 2));
    return;
  }
  const newArray = forecast.array.map((item) => {
    return `${
      Colors.bold(Colors.black(Colors.bgBlue(` ${item.datetime} `)))
    }\n  ${parseWeather(item)}\n`;
  });
  console.log(`${
    Colors.underline(
      `Forecast in ${name} for next ${newArray.length} hours`,
    )
  }\n\n${newArray.join('\n')}`);
}

export async function todayMessage(
  { json }: Options,
  name: string,
): Promise<void> {
  const interval = getHoursLeftForTheDay();
  await forecastMessage({ json }, name, interval);
}

export async function tomorrowMessage(
  { json }: Options,
  name: string,
): Promise<void> {
  const forecast = await getTomorrow(name);
  _forecastMessage({ json }, name, forecast);
}