import { Link } from "react-router";
import classes from "./posts.module.css";
import { getAllPosts } from "./utils";
import type { Route } from "./+types/posts";
import { Back } from '~/components/back';

export function loader() {
  const posts = getAllPosts();
  return { posts };
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  return (
    <div className={classes.container}>
      <Back page="home" to="/" />
      <div className={classes.posts}>
        {loaderData.posts
          .sort((a, b) => {
            if (new Date(a.metadata.date) > new Date(b.metadata.date)) {
              return -1;
            }
            return 1;
          })
          .map(({ slug, metadata: { title, tags, date } }) => (
            <Link key={slug} to={`/posts/${slug}`}>
              <div className={classes.post}>
                <h3>{title}</h3>
                <p>{Intl.DateTimeFormat(navigator.language).format(new Date(date))}</p>
                <p>{tags.join(', ')}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
