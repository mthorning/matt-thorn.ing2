import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router";
import classes from "./back.module.css";

export function Back({ page, to }: {
  page: string;
  to: string;
}) {
  return (
    <Link className={classes.back} to={to}>
      <FaArrowLeft />
      Back to {page}
    </Link>
  )
}
