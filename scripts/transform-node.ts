import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";

const version = Deno.args[0];
if (!version) {
  console.error("Version not provided.");
  Deno.exit(1);
}

const entryPoint = Deno.args[1];
if (!entryPoint) {
  console.error("Entry point not provided.");
  Deno.exit(1);
}

await emptyDir("./dist");

await build({
  entryPoints: [entryPoint],
  outDir: "./dist",
  typeCheck: "both",
  test: false,
  shims: {},
  compilerOptions: { lib: ["ESNext"] },
  packageManager: "npm",
  package: {
    name: "@roziscoding/grammy-autoquote",
    version,
    description: "Unnoficial grammY plugin that automatically quotes user messages",
    author: "Roz <roz@rjmunhoz.me>",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/roziscoding/grammy-autoquote.git",
    },
    devDependencies: {
      "grammy": "^1",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
    Deno.copyFileSync("README.md", "dist/README.md");
  }
});
