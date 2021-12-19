/**
 * - {name}/
 *   - Cargo.toml
 *   - src/
 *     - a.rs
 *     - a.txt
 *     - b.rs
 *     - b.txt
 *     - c.rs
 *     - c.txt
 *     - d.rs
 *     - d.txt
 *     - e.rs
 *     - e.txt
 *     - f.rs
 */

import { ensureDir, ensureFile } from "https://deno.land/std@0.118.0/fs/mod.ts";

if (Deno.args.length !== 1) {
  throw new Error("Please use one commnad line argument.");
}

const name = Deno.args[0];
await ensureDir(`./${name}`);
try {
  const stat = await Deno.lstat(`./${name}/Cargo.toml`);
  if (!stat.isFile) {
    throw new Error(
      "Ensure path exists, expected 'file'",
    );
  } else {
    throw new Error("Cargo.toml already exists.");
  }
} catch (err) {
  // if file not exists
  if (err instanceof Deno.errors.NotFound) {
    // OK
  } else {
    throw err;
  }
}

const fileList = [
  "Cargo.toml",
  "src/a.rs",
  "a.txt",
  "src/b.rs",
  "b.txt",
  "src/c.rs",
  "c.txt",
  "src/d.rs",
  "d.txt",
  "src/e.rs",
  "e.txt",
  "src/f.rs",
  "f.txt",
];

await Promise.all(
  fileList.map(async (f) => await ensureFile(`./${name}/${f}`)),
);

const cargoText = await Deno.readTextFile("./Cargo.toml.example");
await Deno.writeTextFile(
  `./${name}/Cargo.toml`,
  cargoText.replace("{name}", name),
);

const rustText = await Deno.readTextFile("./a.rs.example");
await Promise.all([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
].map(async (c) => await Deno.writeTextFile(`./${name}/src/${c}.rs`, rustText)));
