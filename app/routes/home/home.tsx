import { useRef, type RefObject, type ComponentProps, useState } from 'react';
import clsx from 'clsx';
import RainAnimation from './rain-animation';
import classes from './home.module.css';
import {
  FaBomb,
  FaGithub,
  FaLinkedin,
  FaBluesky,
  FaBars,
  FaArrowLeft,
} from 'react-icons/fa6';
import { Link, useLocation } from 'react-router';
import Minesweeper from './minesweeper/minesweeper';

type View = null | 'about' | 'links' | 'minesweeper';
type CardSide = 'front' | 'back';

function A(props: ComponentProps<'a'>) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    />
  );
}

function BackCard({ currentView, showAbout, playSweeper, showGames }: {
  currentView: View;
  showGames: boolean;
  showAbout: () => void;
  playSweeper: () => void;
}) {
  return currentView === 'links' ? (
    <div className={classes.card}>
      {showGames && (
        <button
          type="button"
          className={clsx(classes.linkButton, classes.topRightButton)}
          onClick={playSweeper}
        >
          <FaBomb />
        </button>
      )}
      <div className={classes.cardContent}>
        <div className={classes.linksContent}>
          <Link to="/posts">Posts</Link>
          <Link to="/photos">Photos</Link>
          <button
            className={classes.linkButton}
            type="button"
            onClick={showAbout}
          >
            About
          </button>
        </div>
      </div>
      <div className={classes.cardFooter}></div>
    </div>
  ) : null;
}

function FrontCard({
  currentView,
  showLinks,
  exitGame,
}: {
  currentView: View;
  showLinks: () => void;
  exitGame: () => void;
}) {
  return currentView === 'about' ? (
    <AboutCard {...{ showLinks }} />
  ) : currentView === 'minesweeper' ? (
    <Minesweeper
      bombs={10}
      gridSize={10}
      cellSize={48}
      ExitButton={() => {
        return <button
          type="button"
          className={classes.linkButton}
          onClick={() => {
            exitGame();
          }}
        >
          <FaArrowLeft />
        </button>
      }}
    />
  ) : null;
}

function AboutCard({ showLinks }: { showLinks: () => void }) {
  return (
    <div className={classes.card}>
      <button
        type="button"
        className={clsx(classes.linkButton, classes.topRightButton)}
        onClick={() => {
          showLinks();
        }}
      >
        <FaBars />
      </button>
      <div className={classes.cardContent}>
        <div className={classes.aboutContent}>
          <div className={classes.aboutName}>
            <img
              className={classes.profilePic}
              src="https://github.com/mthorning.png"
              alt="Profile Photo"
            />
            <h1>Matt Thorning</h1>
            <h3>Software engineer</h3>
          </div>
          <div className={classes.separator} />
          <div className={classes.aboutLinks}>
            <div>
              <p>
                <strong>Location:</strong>{' '}
                <A href="https://www.google.co.uk/maps/place/Cornwall/@50.4431734,-5.6159549,179714m/data=!3m2!1e3!4b1!4m6!3m5!1s0x486ab7f0bf270ec9:0x6e423c85d94b4571!8m2!3d50.5036299!4d-4.6524982!16zL20vMDFxMWo?entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D">
                  Cornwall
                </A>
              </p>
              <p>
                <strong>Company:</strong>{' '}
                <A href="https://grafana.com/">Grafana Labs</A>
              </p>
            </div>
            <div className={classes.aboutFooter}>
              <A href="https://linkedin.com/in/matt-thorning-39a858120">
                <FaLinkedin />
              </A>
              <A href="https://bsky.app/profile/matt-thorn.ing">
                <FaBluesky />
              </A>
              <A href="https://github.com/mthorning">
                <FaGithub />
              </A>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessCard({
  objRef,
}: {
  objRef: RefObject<HTMLDivElement | null>;
}) {
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  const [showGames] = useState(search.get('games') === 'true');

  const [currentView, setCurrentView] = useState<View>(
    search.get('view') === 'links' ? 'links' : 'about'
  );
  const [cardSide, setCardSide] = useState<CardSide>(
    search.get('view') === 'links' ? 'back' : 'front'
  );

  const [addTransition, setAddTransition] = useState(false);
  const [increaseDimensions, setIncreaseDimensions] = useState(false);
  const playSweeper = () => {
    setAddTransition(true);
    setCardSide('front');
    setTimeout(() => {
      setIncreaseDimensions(true);
      setTimeout(() => setCurrentView('minesweeper'), 300);
    }, 600);
  };

  const exitGame = () => {
    setCurrentView(null);
    setCardSide('back');
    setTimeout(() => {
      setTimeout(() => setCurrentView('links'), 300);
      setIncreaseDimensions(false);
    }, 600);
  }

  const [showAbout, showLinks] = [
    ['front', 'about'] as const,
    ['back', 'links'] as const,
  ].map(([cs, cv]) => {
    return () => {
      setCardSide(cs);
      setCurrentView(cv);
    };
  });

  return (
    <div
      ref={objRef}
      className={clsx(classes.perspectiveContainer, {
        [classes.showFront]: cardSide === 'front',
        [classes.showBack]: cardSide === 'back',
        [classes.addTransition]: addTransition,
        [classes.increaseDimensions]: increaseDimensions,
      })}
    >
      <div className={clsx(classes.box, classes.front, classes.about)}>
        <FrontCard {...{ currentView, showLinks, exitGame }} />
      </div>

      <div className={clsx(classes.box, classes.back, classes.links)}>
        <BackCard {...{ currentView, showAbout, playSweeper, showGames }} />
      </div>
    </div>
  );
}

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className={classes.container}>
      <RainAnimation objRef={ref} />
      <BusinessCard objRef={ref} />
    </div>
  );
}
