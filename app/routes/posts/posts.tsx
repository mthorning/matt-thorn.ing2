import { Link } from "react-router";
import classes from "./posts.module.css";
import { getAllPosts } from "./utils";
import type { Route } from "./+types/posts";
import { useMemo, useState } from "react";
import { clsx } from "clsx";

export function loader() {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach(post => post.metadata.tags.forEach(tag => tags.add(tag)));

  return { posts, tags: Array.from(tags) };
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const onTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  }

  const posts = useMemo(() => loaderData.posts
    .sort((a, b) => {
      if (new Date(a.metadata.date) > new Date(b.metadata.date)) {
        return -1;
      }
      return 1;
    }).filter(post =>
      selectedTag === null || post.metadata.tags.includes(selectedTag)
    ), [loaderData.posts, selectedTag])

  return (
    <>
      <div className={classes.tags}>
        {loaderData.tags.map(tag => <button
          key={tag}
          type="button"
          onClick={() => onTagSelect(tag)}
          className={clsx({ [classes.selectedTag]: selectedTag === tag }
          )}>{tag}</button>)}
      </div>
      <div className={classes.posts}>
        {posts.map(({ slug, metadata: { title, tags, date } }) => (
          <Link key={slug} to={`/posts/${slug}`}>
            <div className={classes.post}>
              <h3>{title}</h3>
              <p><strong>Date:</strong> {Intl.DateTimeFormat(navigator.language).format(new Date(date))}</p>
              <p><strong>Tags:</strong> {tags.join(', ')}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
