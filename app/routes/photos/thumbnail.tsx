import { Link } from "react-router";
import type { Datum } from './utils';

export function Thumbnail({ datum }: { datum: Datum }) {
  return (
    <Link prefetch="intent" viewTransition to={`/photos/${datum.filename}`}>
      <img src={datum.thumbUrl} />
    </Link>
  );
}
