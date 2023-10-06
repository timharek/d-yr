import { _fetch } from './util.ts';

const API_URL = new URL('https://nominatim.openstreetmap.org');

// TODO: Not a complete interface
interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
  address?: {
    village: string;
    city: string;
  };
}

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
    const result = await _fetch<SearchResult[]>(API_URL);

    return {
      lat: Number(result[0].lat),
      lng: Number(result[0].lon),
    };
  } catch (_e) {
    console.error(
      `Coordinates lookup failed. Check if "${name}" is spelled correct.`,
    );
    Deno.exit(1);
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
    const result = await _fetch<SearchResult>(API_URL);

    return result.address?.village || result.address?.city || 'null';
  } catch (_e) {
    console.error('Name lookup failed');
    Deno.exit(1);
  }
}

export const Nominatim = {
  getCoordinatesFromName,
  getNameFromCoordinates,
};
