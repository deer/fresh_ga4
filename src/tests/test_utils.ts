import { TextLineStream } from "./test_deps.ts";

export async function startFreshServer(options: Deno.CommandOptions) {
  const { serverProcess, lines, warnLines, address, output } =
    await spawnServer(options);

  if (!address) {
    throw new Error("Server didn't start up");
  }

  return { serverProcess, lines, warnLines, address, output };
}

async function spawnServer(options: Deno.CommandOptions) {
  const serverProcess = new Deno.Command(Deno.execPath(), {
    ...options,
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  const lines: ReadableStream<string> = serverProcess.stdout
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  const warnLines: ReadableStream<string> = serverProcess.stderr
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  const output: string[] = [];
  let address = "";
  // @ts-ignore yes it does
  for await (const line of lines.values({ preventCancel: true })) {
    output.push(line);
    const match = line.match(
      /https?:\/\/localhost:\d+(\/\w+[-\w]*)*/g,
    );
    if (match) {
      address = match[0];
      break;
    }
  }

  return { serverProcess, lines, warnLines, address, output };
}
