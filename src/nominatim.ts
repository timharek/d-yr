import { _fetch } from '../mod.ts';

const API_URL = new URL('https://nominatim.openstreetmap.org');

/**
 * Get coordinates based on name.
 *
 * @param name Query name
 * @returns Coordinates assosiated with `name`
 */
async function getCoordinatesFromName(
  name: string,
): Promise<{ lat: number; lng: number }> {
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

/**
 * Get name based on coordinates.
 *
 * @param lat Latitude
 * @param lng Longitude
 * @returns Name assosiated with coordinates
 */
async function getNameFromCoordinates(
  coordinates: Coordinates,
): Promise<string> {
  const { lat, lng } = coordinates;
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

export const Nominatim = {
  getCoordinatesFromName,
  getNameFromCoordinates,
};
