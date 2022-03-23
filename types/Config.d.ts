import { YrWeather } from './YrWeather.d.ts';

export interface Config {
	coordinates: {
		lat: number;
		lng: number;
	};
}

export interface Data {
	config?: Config;
	response?: YrWeather;
}
