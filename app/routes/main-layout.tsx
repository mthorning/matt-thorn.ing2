import { FaHome } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useMatches, type UIMatch } from "react-router";
import classes from './main-layout.module.css';
import { Outlet } from 'react-router';

export default function() {
  const matches = useMatches() as UIMatch<undefined, { Breadcrumb: React.ElementType }>[];
  const matchesWithCrumbs = matches.filter(match => match?.handle?.Breadcrumb);

  return (
    <div className={classes.container}>
      <div className={classes.breadcrumbs}>
        <Link to='/?view=links'><FaHome className={classes.home} /></Link>
        {matchesWithCrumbs
          .map(match => (
            <>
              <MdKeyboardArrowRight />
              <match.handle.Breadcrumb />
            </>
          ))}
      </div>
      <Outlet />
    </div>
  );
}
