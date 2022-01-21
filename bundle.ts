/**
 * - {name}/
 *   - .vscode
 *     - workspace.code-workspace
 *   - Cargo.toml
 *   - a.txt
 *   - b.txt
 *   - c.txt
 *   - d.txt
 *   - e.txt
 *   - f.txt
 *   - g.txt
 *   - h.txt
 *   - src/
 *     - a.rs
 *     - b.rs
 *     - c.rs
 *     - d.rs
 *     - e.rs
 *     - f.rs
 *     - g.rs
 *     - h.rs
 *   - bundle/
 *     - a.rs
 *     - b.rs
 *     - c.rs
 *     - d.rs
 *     - e.rs
 *     - f.rs
 *     - g.rs
 *     - h.rs
 */

import { ensureDir } from "https://deno.land/std@0.122.0/fs/mod.ts";
import { parse } from "https://deno.land/std@0.122.0/encoding/toml.ts";

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

const cargoText = await Deno.readTextFile(`${path}/Cargo.toml`);
const cargo = parse(cargoText) as {
  dependencies: {
    wyf_lib: {
      path: string;
    };
  };
};
const myLibPath = cargo.dependencies.wyf_lib.path;
const libText = await Deno.readTextFile(`${path}/${myLibPath}/src/lib.rs`);

await Promise.all([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
].map(async (c) => {
  const text = await Deno.readTextFile(`${path}/src/${c}.rs`);
  await Deno.writeTextFile(
    `${path}/bundle/${c}.rs`,
    (text + textIOSan + libText).replace("use text_io", "// use text_io")
      .replace("use wyf_lib", "// use wyf_lib"),
  );
}));
