import { FaArrowLeft, FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router";
import type { Route } from "./+types/post";
import { getPostBySlug } from "./utils";
import classes from "./post.module.css";

export default function Post({ params }: Route.ComponentProps) {
  const post = getPostBySlug(params.slug)!;

  const age =
    new Date().getFullYear() - new Date(post.metadata.date).getFullYear();

  return (
    <>
      <div className={classes.container}>
        <Link className={classes.back} to="/posts">
          <FaArrowLeft />
          Back to posts
        </Link>
        <h1 className={classes.title}>{post.metadata.title}</h1>
        <h5>Published: {post.metadata.date.replace(/T.*$/, "")}</h5>
        {age > 2 ? (
          <div className={classes.ageWarning}>
            <FaExclamationCircle className={classes.icon} />
            <p className={classes.ageWarningMessage}>
              This article is {age} years old. The information within may be
              out-of-date and some of the examples may no longer work.
            </p>
          </div>
        ) : null}
        <main><post.Component /></main>
      </div>
    </>
  );
}
