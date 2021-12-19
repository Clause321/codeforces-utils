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
  "a.txt",
  "b.txt",
  "c.txt",
  "d.txt",
  "e.txt",
  "f.txt",
];

await Promise.all(
  fileList.map(async (f) => await ensureFile(`./${name}/${f}`)),
);

const cargoRes = await fetch(
  "https://raw.githubusercontent.com/Clause321/codeforces-utils/master/Cargo.toml.example",
);
const cargoText = await cargoRes.text();
await Deno.writeTextFile(
  `./${name}/Cargo.toml`,
  cargoText.replace("{name}", name),
);

const rustRes = await fetch(
  "https://raw.githubusercontent.com/Clause321/codeforces-utils/master/a.rs.example",
);
const rustText = await rustRes.text();
await Promise.all([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
].map(async (c) =>
  await Deno.writeTextFile(`./${name}/src/${c}.rs`, rustText)
));
