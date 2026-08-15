import type { Config } from "@react-router/dev/config";
import fs from 'fs'

const postSlugs = fs.readdirSync('./app/routes/posts/mdx');

export default {
  ssr: true,
  async prerender() {
    return [
      '/posts',
      ...postSlugs.map(slug => `/posts/${slug}`),
    ];
  },
} satisfies Config;
