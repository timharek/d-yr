import { _fetch } from '../mod.ts';

const API_URL = new URL('https://nominatim.openstreetmap.org');

export async function getCoordinatesFromName(name: string) {
  API_URL.pathname = '/search';
  API_URL.searchParams.set('format', 'json');
  API_URL.searchParams.set('q', name);

  try {
    const result = await _fetch(API_URL);

    return {
      lat: result[0].lat,
      lng: result[0].lon,
    };
  } catch (e) {
    throw new Error(e);
  }
}

export async function getNameFromCoordinates(lat: number, lng: number) {
  API_URL.pathname = '/reverse';
  API_URL.searchParams.set('format', 'json');
  API_URL.searchParams.set('lat', String(lat));
  API_URL.searchParams.set('lon', String(lng));

  try {
    const result = await _fetch(API_URL);

    return result.address.village || result.address.city;
  } catch (e) {
    throw new Error(e);
  }
}
