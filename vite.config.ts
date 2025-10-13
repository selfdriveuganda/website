import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const PESAPAL_API_PATH = /^\/api\/pesapal/;

const config = defineConfig({
	plugins: [
		// this is the plugin that enables path aliases
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
	server: {
		proxy: {
			"/api/pesapal": {
				target: "https://cybqa.pesapal.com/pesapalv3",
				changeOrigin: true,
				rewrite: (path) => path.replace(PESAPAL_API_PATH, ""),
			},
		},
	},
});

export default config;
