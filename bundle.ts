/**
 * - {name}/
 *   - Cargo.toml
 *   - a.txt
 *   - b.txt
 *   - c.txt
 *   - d.txt
 *   - e.txt
 *   - f.txt
 *   - src/
 *     - a.rs
 *     - b.rs
 *     - c.rs
 *     - d.rs
 *     - e.rs
 *     - f.rs
 *   - bundle/
 *     - a.rs
 *     - b.rs
 *     - c.rs
 *     - d.rs
 *     - e.rs
 *     - f.rs
 */

import { ensureDir, ensureFile } from "https://deno.land/std@0.118.0/fs/mod.ts";

if (Deno.args.length !== 1) {
  throw new Error("Please use one commnad line argument.");
}

const path = Deno.args[0];

await ensureDir(`${path}/bundle`);

const textIORes = await fetch(
  "https://raw.githubusercontent.com/oli-obk/rust-si/main/src/lib.rs",
);
const textIO = await textIORes.text();
const textIOSan = textIO.replace("let stdin: &mut", "let stdin: &mut dyn")
  .split("\n").filter((line) => !line.startsWith("//")).join("\n");

await Promise.all([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
].map(async (c) => {
  const text = await Deno.readTextFile(`${path}/src/${c}.rs`);
  await Deno.writeTextFile(
    `${path}/bundle/${c}.rs`,
    textIOSan + text.replace("use text_io", "// use text_io"),
  );
}));
