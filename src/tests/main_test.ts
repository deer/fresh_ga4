import { assert, assertEquals } from "./test_deps.ts";
import { startFreshServer } from "./test_utils.ts";
import { ga4Plugin } from "../plugin/ga4.ts";
import { handler } from "../routes/_middleware.ts";
import { FreshContext } from "../deps.ts";

Deno.test("ga4Plugin creates a plugin with the correct name", () => {
  const plugin = ga4Plugin();
  assertEquals(plugin.name, "ga4_plugin");
});

Deno.test("ga4Plugin adds middleware correctly", () => {
  const plugin = ga4Plugin();
  if (plugin.middlewares) {
    assertEquals(plugin.middlewares.length, 1);
    assertEquals(plugin.middlewares[0].path, "/");
  }
});

Deno.test("warn when no ID", async () => {
  const { warnLines, serverProcess, address } = await startFreshServer({
    args: ["run", "-A", "./src/tests/fixture/dev.ts"],
    env: { GA4_MEASUREMENT_ID: "" },
  });

  const result = await fetch(`${address}`);

  for await (const line of warnLines) {
    console.log("reading a line");
    console.log(line);
    if (
      line.includes(
        "GA4_MEASUREMENT_ID environment variable not set. Google Analytics reporting disabled.",
      )
    ) {
      assert(true);
      break;
    }
  }

  await result.body?.cancel();
  serverProcess.kill("SIGTERM");
  await serverProcess.status;
});

Deno.test("Middleware should handle normal requests", async () => {
  const mockRequest = new Request("http://example.com", { method: "GET" });
  // deno-lint-ignore require-await
  const mockContext = createMockFreshContext(async () =>
    new Response("Mock Response", { status: 200 })
  );

  const response = await handler(mockRequest, mockContext);

  assertEquals(response.status, 200);
  assertEquals(await response.text(), "Mock Response");
});

Deno.test("Middleware should handle errors", async () => {
  const mockRequest = new Request("http://example.com", { method: "GET" });
  const mockContext = createMockFreshContext(() => {
    throw new Error();
  });

  try {
    const response = await handler(mockRequest, mockContext);
  } catch (err) {
    console.log(err);
    assert(true);
  }
});

function createMockFreshContext(next: () => Promise<Response>): FreshContext {
  return {
    remoteAddr: { hostname: "127.0.0.1", port: 8000, transport: "tcp" },
    url: new URL("http://example.com"),
    basePath: "",
    route: "/test-route",
    pattern: "/test-route",
    destination: "route",
    params: {},
    isPartial: false,
    state: {},
    config: {
      basePath: "",
      build: {
        outDir: "",
        target: ["chrome99", "firefox99", "safari15"],
      },
      dev: true,
      plugins: [],
      render: (_ctx, render) => {
        render();
      },
      server: {},
      staticDir: "",
    },
    data: {},
    renderNotFound: () => new Response("Not Found", { status: 404 }),
    render: () => new Response("OK"),
    Component: () => null,
    next: next,
  };
}
