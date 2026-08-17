import { FaExclamationCircle } from "react-icons/fa";
import type { Route } from "./+types/post";
import { getPostBySlug } from "./utils";
import classes from "./post.module.css";
import { Link } from "react-router";

export const handle = {
  Breadcrumb: () => <Link to='/posts'>Posts</Link>
}

export function clientLoader({ params }: Route.LoaderArgs) {
  const post = getPostBySlug(params.slug)!;

  if (post == null) {
    throw new Response('Post Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }
  return { post };
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post: { Component, metadata: { date, title } } } = loaderData;

  const age =
    new Date().getFullYear() - new Date(date).getFullYear();

  return (
    <>
      <h1 className={classes.title}>{title}</h1>
      <h5>Published: {Intl.DateTimeFormat(navigator.language).format(new Date(date))}</h5>
      {age > 2 ? (
        <div className={classes.ageWarning}>
          <FaExclamationCircle className={classes.icon} />
          <p className={classes.ageWarningMessage}>
            This article is {age} years old. The information within is likely
            out-of-date and the examples/links may no longer work.
          </p>
        </div>
      ) : null}
      <main className={classes.content}><Component /></main>
    </>
  );
}
