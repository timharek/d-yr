# d-yr

Using the Yr.no / MET.no weather API with Deno.

## Install

```sh
deno install --allow-net --allow-read --allow-env -n yr https://raw.githubusercontent.com/timharek/d-yr/main/main.ts
```

You have now installed d-yr as `yr`.

## Setup

If you are missing a config-file in `$HOME/.config/yr/config.json`, it will ask
if you want to create one, and fail if you say no.

Run the project with:

```sh
# Current weather forecast for location
yr current Bergen
# OR forecast for location
yr forecast Bangkok
# Forecast with coordinates
yr forecast --lat=-34.44076 --lng=-58.70521
```

