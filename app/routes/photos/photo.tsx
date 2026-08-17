import { Link } from 'react-router';
import type { Route } from './+types/photo';
import classes from './photo.module.css';
import { getImageURLs } from './utils';

export const handle = {
  Breadcrumb: () => <Link to="/photos">Photos</Link>,
};

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const data = await getImageURLs();
    const selectedImage = data.find(
      (datum) => datum.filename === params.filename
    );
    const galleryImages = data.filter(
      (datum) => datum.filename !== params.filename
    );

    return { selectedImage, galleryImages };
  } catch (_) {
    throw new Response('Error fetching images', {
      status: 500,
      statusText: 'Server Error',
    });
  }
}

export default function Photos({ loaderData }: Route.ComponentProps) {
  return (
    <div className={classes.page}>
      <div className={classes.selectedImage}>
        <img src={loaderData.selectedImage?.fullsizeUrl} />
      </div>
      <div className={classes.gallery}>
        {loaderData?.galleryImages?.map((datum) => (
          <Link to={datum.filename}>
            <img src={datum.thumbUrl} />
          </Link>
        ))}
      </div>
    </div>
  );
}
