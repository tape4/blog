import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
    site: "https://tape4.io",
    integrations: [mdx(), sitemap(), tailwind()],
});
