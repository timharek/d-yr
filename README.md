# d-yr

Using the Yr.no / MET.no weather API with Deno.

This project has both a CLI and functions to access Yr.no's API.

## Usage

```js
import { Yr } from 'https://raw.githubusercontent.com/timharek/d-yr/HEAD/mod.ts';
```

## Install CLI

```sh
deno install --allow-net=api.met.no,nominatim.openstreetmap.org -n yr https://raw.githubusercontent.com/timharek/d-yr/HEAD/cli.ts
```

You have now installed d-yr as `yr`.

## Setup

Run the project with:

```sh
# Current weather forecast for location
yr current Bergen
# OR forecast for location
yr forecast Bangkok
```
