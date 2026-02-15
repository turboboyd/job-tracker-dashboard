import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { BuildOptions } from "./types";

function getPublicPath(): string {
  const fromEnv = process.env.PUBLIC_URL?.trim();
  if (fromEnv) return `${fromEnv.replace(/\/$/, "")}/`;

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (process.env.GITHUB_ACTIONS === "true" && repo) return `/${repo}/`;

  return "/";
}

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
  const publicPath = getPublicPath();

  return {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    static: {
      directory: options.paths.public,
      publicPath,
      watch: true,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  };
}
