import { defineConfig } from "$fresh/server.ts";
import { ga4Plugin } from "../../../mod.ts";

export default defineConfig({ plugins: [ga4Plugin()] });
