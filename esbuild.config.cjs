const { build } = require("esbuild");

// Common build configuration
const commonConfig = {
  bundle: true,
  minify: true,
  external: ["react", "react-dom"],
  loader: {
    ".css": "text", // Handle CSS files as text
  },
};

// CJS build
build({
  ...commonConfig,
  entryPoints: ["src/index.ts"],
  platform: "node",
  format: "cjs",
  outfile: "dist/index.js",
}).catch(() => process.exit(1));

// ESM build
build({
  ...commonConfig,
  entryPoints: ["src/index.ts"],
  platform: "node",
  format: "esm",
  outfile: "dist/index.esm.js",
}).catch(() => process.exit(1));
