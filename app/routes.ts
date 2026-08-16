import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home/home.tsx'),
  layout('routes/main-layout.tsx', [
    route('/posts', 'routes/posts/posts.tsx'),
    route('/posts/:slug', 'routes/posts/post.tsx'),
    route('/photos', 'routes/photos/photos.tsx'),
  ]),
] satisfies RouteConfig;
