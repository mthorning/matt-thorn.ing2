import { Link } from 'react-router';
import type { Route } from './+types/photo';
import classes from './photo.module.css';
import { getImageURLs } from './utils';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';

export const handle = {
  Breadcrumb: () => <Link to="/photos">Photos</Link>,
};

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const images = await getImageURLs();
    const selectedIdx = images.findIndex(
      (image) => image.filename === params.filename
    );

    return {
      selectedIdx,
      images,
    };
  } catch (_) {
    throw new Response('Error fetching images', {
      status: 500,
      statusText: 'Server Error',
    });
  }
}

function useArrowBtns(defaultIdx: number, totalImages: number) {
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx); const ArrowBtn = ({ direction }: { direction: 'prev' | 'next' }) => {
    return (
      <button
        onClick={() => {
          let newValue = selectedIdx + (direction === 'prev' ? -1 : 1);

          if (newValue < 0) newValue = totalImages - 1;
          if (newValue > totalImages - 1) newValue = 0;

          setSelectedIdx(newValue);
        }}
        className={classes.arrowButton}
      >
        {direction === 'prev' ? <FaArrowLeft /> : <FaArrowRight />}
      </button>
    );
  };

  return {
    selectedIdx,
    setSelectedIdx,
    ArrowBtn,
  };
}

export default function Photos({ loaderData }: Route.ComponentProps) {
  const { selectedIdx, setSelectedIdx, ArrowBtn } = useArrowBtns(
    loaderData.selectedIdx,
    loaderData.images.length
  );

  return (
    <div className={classes.page}>
      <div className={classes.selectedImage}>
        <img src={loaderData.images[selectedIdx]?.fullsizeUrl} />
      </div>
      <div className={classes.arrowButtons}>
        <ArrowBtn direction="prev" />
        <ArrowBtn direction="next" />
      </div>
      <div className={classes.gallery}>
        {loaderData?.images?.map((datum, i) => (
          <button
            key={datum.filename}
            className={classes.thumbnail}
            onClick={() => setSelectedIdx(i)}
          >
            <img
              src={datum.thumbUrl}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
