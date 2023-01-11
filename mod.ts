export { Nominatim } from './src/nominatim.ts';
export { Yr } from './src/yr.ts';
export { Yr as IYr } from './mod.d.ts';

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
