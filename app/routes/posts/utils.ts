type FrontMatter = {
  date: string;
  title: string;
  tags: string[];
  published: boolean;
};

const modules: Record<
  string,
  {
    default: React.ElementType;
    frontmatter: FrontMatter;
  }
> = import.meta.glob("/app/routes/posts/mdx/**/page.mdx", {
  eager: true,
});

type Post = {
  slug: string;
  Component: React.ElementType;
  metadata: FrontMatter;
};

export function getAllPosts(): Post[] {
  const posts = Object.keys(modules).map((filePath) => {
    const parts = filePath.split("/");
    const slug = parts[parts.length - 2];
    const module = modules[filePath];

    if (!module) return null;

    return {
      slug,
      Component: module.default,
      metadata: module.frontmatter || {},
    };
  });

  return posts.filter(post => post !== null);
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post?.slug === slug);
}
