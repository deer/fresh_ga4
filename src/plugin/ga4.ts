import { Plugin } from "../../deps.ts";
import { handler } from "../routes/_middleware.ts";
export type { GA4Options };

// deno-lint-ignore no-empty-interface
interface GA4Options {
}

export function ga4Plugin(_options?: GA4Options): Plugin {
  return {
    name: "ga4_plugin",
    middlewares: [{
      middleware: { handler: handler },
      path: "/",
    }],
  };
}
