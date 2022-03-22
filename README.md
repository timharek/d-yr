# d-yr

Using the Yr.no / MET.no weather API with Deno.

## Setup

If you are missing a config-file in `$HOME/.config/yr/config.json`, 
it will ask if you want to create one, and fail if you say no.

Run the project with:
```sh
# For full forcast
deno run --allow-net --allow-read --allow-write --allow-env App.ts -f 
# OR for current
deno run --allow-net --allow-read --allow-write --allow-env App.ts -c
```

## Work in progress

This is one of my first projects with Deno.
