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

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
];

/* CREATE FILES */

const fileList = [
  ...letters.flatMap((l) => [`${l}.txt`, `src/${l}.rs`]),
  "build.rs",
  ".vscode/workspace.code-workspace",
];

await Promise.all(
  fileList.map(async (f) => await ensureFile(`./${name}/${f}`)),
);

/* WRITE CARGO */

const cargoRes = await fetch(
  "https://raw.githubusercontent.com/Clause321/codeforces-utils/master/Cargo.toml.example",
);
const cargoText = await cargoRes.text();
await Deno.writeTextFile(
  `./${name}/Cargo.toml`,
  cargoText.replace("{name}", name),
);

/* WRITE SRC */

const rustRes = await fetch(
  "https://raw.githubusercontent.com/Clause321/codeforces-utils/master/a.rs.example",
);
const rustText = await rustRes.text();
await Promise.all(
  letters.map(async (c) =>
    await Deno.writeTextFile(`./${name}/src/${c}.rs`, rustText)
  ),
);

/* WRITE BUILD */

const buildRes = await fetch(
  "https://raw.githubusercontent.com/Clause321/codeforces-utils/master/build.rs",
);
const buildText = await buildRes.text();
await Deno.writeTextFile(`./${name}/build.rs`, buildText);

/* WRITE WORKSPACE */
const workspaceConfig = {
  folders: [
    { name: "Main", path: ".." },
    { name: "Parent", path: "..\\.." },
    { name: "Codeforces Utils", path: "..\\..\\..\\codeforces-utils" },
  ],
  settings: {
    "deno.enable": true,
    "deno.lint": true,
    "deno.unstable": true,
  },
  launch: {
    version: "0.2.0",
    configurations: letters.map((l) => ({
      // https://github.com/vadimcn/vscode-lldb/blob/master/MANUAL.md
      type: "lldb",
      request: "launch",
      name: `Debug ${l}`,
      cargo: {
        args: [
          "build",
          `--bin=${l}`,
          `--package=${name}`,
        ],
        filter: {
          name: l,
          kind: "bin",
        },
      },
      args: [],
      cwd: "${workspaceFolder:Main}",
      stdio: ["${workspaceFolder:Main}/" + l + ".txt", null],
    })),
  },
};
await Deno.writeTextFile(
  `./${name}/.vscode/workspace.code-workspace`,
  JSON.stringify(workspaceConfig, null, 2),
);
