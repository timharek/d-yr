import { currentWeather, fetchYr, upcomingForecast } from './yr.ts';
import { Data } from './types.d.ts';
import { CONFIG, CONFIG_FILE_PATH, FLAGS, getConfig } from './config.ts';
import { printHelp } from './deps.ts';

const data: Data = {
  config: await getConfig().then((res) => res),
};

if (FLAGS.help) {
  printHelp(CONFIG);
  Deno.exit(1);
}

if (FLAGS.config && FLAGS.lat && FLAGS.lng) {
  console.error(
    'You cannot provide a config path, and coordinates. You can only provide one.',
  );
}

if (FLAGS.lat && FLAGS.lng) {
  data.config = {
    coordinates: {
      lat: Number(FLAGS.lat),
      lng: Number(FLAGS.lng),
    },
  };
}

if (FLAGS.config) {
  console.log('Setting config path', FLAGS.config);
  data.config = await getConfig(String(FLAGS.config)).then((res) => res);
}

if (FLAGS.getConfig) {
  console.log(`Config path: ${CONFIG_FILE_PATH}`);
  console.log(data.config);
  Deno.exit(1);
}

if (data.config) {
  const coordinates = data.config.coordinates;
  const yrUrl =
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lng}`;

  data.response = await fetchYr(yrUrl);
}

if (FLAGS.current && data.response) {
  console.log(currentWeather(data.response));
}

if (FLAGS.forecast && data.response) {
  console.log(upcomingForecast(data.response));
}
