# d-yr

Using the Yr.no / MET.no weather API with Deno.

## Install

```sh
deno install --allow-net --allow-read --allow-env -n yr https://raw.githubusercontent.com/timharek/d-yr/main/App.ts
```

You have now installed d-yr as `yr`.

## Setup

If you are missing a config-file in `$HOME/.config/yr/config.json`, it will ask
if you want to create one, and fail if you say no.

Run the project with:

```sh
# For full forcast
yr -f
# OR for current
yr -c
```

## Work in progress

This is one of my first projects with Deno.
