[![sourcehut](https://img.shields.io/badge/repository-sourcehut-lightgrey.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSINCiAgICB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+DQogIDxkZWZzPg0KICAgIDxmaWx0ZXIgaWQ9InNoYWRvdyIgeD0iLTEwJSIgeT0iLTEwJSIgd2lkdGg9IjEyNSUiIGhlaWdodD0iMTI1JSI+DQogICAgICA8ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMCIgc3RkRGV2aWF0aW9uPSIxLjUiDQogICAgICAgIGZsb29kLWNvbG9yPSJibGFjayIgLz4NCiAgICA8L2ZpbHRlcj4NCiAgICA8ZmlsdGVyIGlkPSJ0ZXh0LXNoYWRvdyIgeD0iLTEwJSIgeT0iLTEwJSIgd2lkdGg9IjEyNSUiIGhlaWdodD0iMTI1JSI+DQogICAgICA8ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMCIgc3RkRGV2aWF0aW9uPSIxLjUiDQogICAgICAgIGZsb29kLWNvbG9yPSIjQUFBIiAvPg0KICAgIDwvZmlsdGVyPg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjUwJSIgY3k9IjUwJSIgcj0iMzglIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQlIg0KICAgIGZpbGw9Im5vbmUiIGZpbHRlcj0idXJsKCNzaGFkb3cpIiAvPg0KICA8Y2lyY2xlIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjM4JSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0JSINCiAgICBmaWxsPSJub25lIiBmaWx0ZXI9InVybCgjc2hhZG93KSIgLz4NCjwvc3ZnPg0KCg==)](https://sr.ht/~timharek/d-yr)
[![GitHub mirror](https://img.shields.io/badge/mirror-GitHub-black.svg?logo=github)](https://github.com/timharek/d-yr)
[![Codeberg mirror](https://img.shields.io/badge/mirror-Codeberg-blue.svg?logo=codeberg)](https://codeberg.org/timharek/d-yr)

[![builds.sr.ht status](https://builds.sr.ht/~timharek/d-yr.svg)](https://builds.sr.ht/~timharek/d-yr)

# d-yr

Access Yr's weather API and Nominatim's names API for getting weather details
about a specific location.

You can read more about the API's on [met.yr.no](https://api.met.no/weatherapi/locationforecast/2.0/documentation) and [Nominatim](https://nominatim.org/).

This project has both a CLI and functions to access Yr.no's API.

## Usage

### Example for current weather

```ts
import { getCurrentWeather } from "https://deno.land/x/dyr/mod.ts";

const currentWeather = getCurrentWeather("Bergen");
// do what you need to do with the weather data.
```

### Example for forecasted weather

```ts
import { getForecastedWeather } from "https://deno.land/x/dyr/mod.ts";

const location = "Bergen";
const hoursAhead = 5;
const jsonOutput = true; // The returned response as JSON

const currentWeather = getForecastedWeather(location, hoursAhead, jsonOutput);
// do what you need to do with the weather data.
```

## CLI

### Installation

```sh
deno install --allow-net=api.met.no,nominatim.openstreetmap.org \
  -n yr https://deno.land/x/dyr/src/cli.ts
```

You have now installed d-yr as `yr`.

### Usage

Run the CLI with:

```sh
# Current weather forecast for location
yr current Bergen
# OR forecast for location
yr forecast Bangkok 5
```
