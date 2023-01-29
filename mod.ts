export { Nominatim } from './src/nominatim.ts';
export { Yr } from './src/yr.ts';

/**
 * Shared fetch-function for simple GET-requests.
 *
 * @param url The URL to send GET-request to
 * @returns Result from GET-request.
 */
export async function _fetch(url: string | URL) {
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });

  return result;
}
