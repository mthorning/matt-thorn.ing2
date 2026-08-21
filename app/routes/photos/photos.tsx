import { Link } from 'react-router';
import type { Route } from './+types/photos';
import classes from './photos.module.css';
import { getImageURLs } from './utils';


export async function loader() {
  try {
    const data = await getImageURLs()
    return { data };
  } catch (_) {
    throw new Response('Error fetching images', {
      status: 500,
      statusText: 'Server Error',
    });
  }
}

export default function Photos({ loaderData }: Route.ComponentProps) {
  return (
    <div className={classes.gallery}>
      {loaderData?.data?.map(datum => (
        <Link
          key={datum.filename}
          prefetch="intent"
          to={`/photos/${datum.filename}`}
        >
          <img
            className={classes.img}
            src={datum.thumbUrl}
          />
        </Link>
      ))}
    </div>
  );
}
