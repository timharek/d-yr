import { assertEquals } from 'https://deno.land/std@0.176.0/testing/asserts.ts';
import {
  cleanForecast,
  getDayAfterDate,
  getEarliestTimeseries,
  getUrl,
} from './util.ts';
import { TimeseriesMinified } from './yr.ts';

Deno.test('Earliest time series', () => {
  const timeseries1: Partial<Yr.ITimeseries> = {
    time: '2023-01-27T10:30:00Z',
  };
  const timeseries2: Partial<Yr.ITimeseries> = {
    time: '2023-01-27T09:30:00Z',
  };

  const timeseriesArray = [timeseries1, timeseries2] as Yr.ITimeseries[];

  const closetsTimeSeries = getEarliestTimeseries(
    timeseriesArray,
  );

  assertEquals(closetsTimeSeries, timeseries2);
});

Deno.test('Clean forecast, remove all undefined', () => {
  const timeseries1: TimeseriesMinified = {
    datetime: 'test',
    rain: 'test',
    symbol: 'test',
    temperature: 'test',
    wind_direction: 0,
    wind_speed: 'test',
  };

  const array: (TimeseriesMinified | undefined)[] = [
    timeseries1,
    undefined,
  ];

  assertEquals(array.length, 2);

  const cleanedArray = cleanForecast(array);

  assertEquals(cleanedArray.length, 1);
});

Deno.test('Get API URL with coordinates', () => {
  const lat = 1;
  const lon = 2;
  const url = getUrl(lat, lon);

  assertEquals(url.searchParams.get('lat'), lat.toString());
  assertEquals(url.searchParams.get('lon'), lon.toString());
});

Deno.test('Get date on day after 2023-02-04', () => {
  const date = new Date('2023-02-04');

  const nextDay = getDayAfterDate(date);

  assertEquals(nextDay.toISOString().split('T')[0], '2023-02-05');
});

Deno.test('Get date on day after 2023-02-04T20:00:00.000Z', () => {
  const date = new Date('2023-02-04T20:00:00.000Z');

  const nextDay = getDayAfterDate(date);

  assertEquals(nextDay.toISOString().split('T')[0], '2023-02-05');
});
