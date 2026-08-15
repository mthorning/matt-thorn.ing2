import { Link } from "react-router";
import "./posts.module.css";
import { getAllPosts } from "./utils";
import type { Route } from "./+types/posts";

export function loader() {
  const posts = getAllPosts();
  return { posts };
}

export default function Posts({ loaderData }: Route.ComponentProps ) {
  return (
      <main className="container line-numbers">
        {loaderData.posts
          .sort((a, b) => {
            if (new Date(a.metadata.date) > new Date(b.metadata.date)) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link key={post.slug} to={`/posts/${post.slug}`}>
              <div>
                <h3>{post.metadata.title}</h3>
              </div>
            </Link>
          ))}
      </main>
  );
}
