import { assertEquals } from 'https://deno.land/std@0.174.0/testing/asserts.ts';
import { YrForTesting } from '../src/yr.ts';

Deno.test('Earliest time series', () => {
  const timeseries1: Partial<Yr.ITimeseries> = {
    time: '2023-01-27T10:30:00Z',
  };
  const timeseries2: Partial<Yr.ITimeseries> = {
    time: '2023-01-27T09:30:00Z',
  };

  const timeseriesArray = [timeseries1, timeseries2] as Yr.ITimeseries[];

  const closetsTimeSeries = YrForTesting.getEarliestTimeseries(
    timeseriesArray,
  );

  assertEquals(closetsTimeSeries, timeseries2);
});

Deno.test('Clean forecast, remove all undefined', () => {
  const timeseries1: CLI.ITimeseriesSimple = {
    datetime: 'test',
    rain: 'test',
    symbol: 'test',
    temperature: 'test',
    wind_direction: 0,
    wind_speed: 'test',
  };

  const array: (CLI.ITimeseriesSimple | undefined)[] = [
    timeseries1,
    undefined,
  ];

  assertEquals(array.length, 2);

  const cleanedArray = YrForTesting.cleanForecast(array);

  assertEquals(cleanedArray.length, 1);
});
