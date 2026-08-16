import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("/posts", "routes/posts/posts.tsx"),
  route("/posts/:slug", "routes/posts/post.tsx"),
] satisfies RouteConfig;
