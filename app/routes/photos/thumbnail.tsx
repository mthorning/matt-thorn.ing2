import { Link } from 'react-router';
import type { Datum } from './utils';
import classes from './thumbnail.module.css';
import { clsx } from 'clsx';

export function Thumbnail({ datum, withEffects = false }: {
  datum: Datum,
  withEffects?: boolean;
}) {
  return (
    <Link
      prefetch="intent"
      viewTransition
      to={`/photos/${datum.filename}`}
    >
      <img
        className={clsx(classes.img, withEffects && classes.effects)}
        src={datum.thumbUrl}
      />
    </Link>
  );
}
