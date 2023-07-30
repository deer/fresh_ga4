## Fresh GA4

This project provides a
[Fresh Plugin](https://fresh.deno.dev/docs/concepts/plugins) that embeds GA4
middleware into your project.

Much credit to the [Fresh](https://fresh.deno.dev/) authors, specifically
whoever worked on the
[www/routes/_middleware.ts](https://github.com/denoland/fresh/blob/430be774e21b98225bd23d9b7807ed11e8aa9bdc/www/routes/_middleware.ts)
file, since I just copied that here.

## Usage

In your `main.ts` (or wherever you invoke `start`) add an import like the
following:

```ts
import { ga4Plugin } from "https://deno.land/x/fresh_ga4@0.0.1/mod.ts";
```

(Note: you probably want to use the latest version, which isn't 0.0.1, but don't do this:
`https://deno.land/x/fresh_ga4/mod.ts`.)

Then change your `start` invocation like so:

```diff
-await start(manifest);
+await start(manifest, { plugins: [ga4Plugin()] });
```

Make sure you have `GA4_MEASUREMENT_ID` set as an environment variable.
