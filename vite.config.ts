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
	define: {
		// Make environment variables available at build time
		"process.env.PESAPAL_BASE_URL": JSON.stringify(
			process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3/api"
		),
		"process.env.PESAPAL_CONSUMER_KEY": JSON.stringify(
			process.env.PESAPAL_CONSUMER_KEY || ""
		),
		"process.env.PESAPAL_CONSUMER_SECRET": JSON.stringify(
			process.env.PESAPAL_CONSUMER_SECRET || ""
		),
		"process.env.PESAPAL_IPN_ID": JSON.stringify(
			process.env.PESAPAL_IPN_ID || ""
		),
	},
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
