import { execa, type Options } from "execa";
import os from "node:os";

export async function exec(
  command: string,
  args: string[] = [],
  opts?: Options,
) {
  // run the check from tmpdir to avoid corepack conflicting -
  // this is no longer needed as of https://github.com/nodejs/corepack/pull/167
  // but we'll keep the behavior for those on older versions)
  const execOptions: Options = {
    cwd: os.tmpdir(),
    env: { COREPACK_ENABLE_STRICT: "0" },
    ...opts,
  };
  try {
    const { stdout } = await execa(command, args, execOptions);
    return stdout.trim();
  } catch {
    return undefined;
  }
}
