import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeShiki from "@shikijs/rehype";

export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: {
              light: "ayu-light",
              dark: "ayu-mirage",
            },
          },
        ],
      ],
    }),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
