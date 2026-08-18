import { useRef, type MutableRefObject, type ComponentProps, useState } from 'react';
import clsx from 'clsx';
import RainAnimation from './rain-animation';
import classes from './home.module.css';
import { FaGithub, FaLinkedin, FaBluesky, FaBars } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router';

function A(props: ComponentProps<'a'>) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

function LinksCard({ toggle }: { toggle: () => void }) {
  return (
    <div className={classes.card}>
      <div className={classes.cardContent}>
        <div className={classes.linksContent}>
          <Link to="/posts">Posts</Link>
          <Link to="/photos">Photos</Link>
          <button className={classes.linkButton} type="button" onClick={toggle}>About</button>
        </div>
      </div>
      <div className={classes.cardFooter}>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className={classes.card}>
      <div className={classes.cardContent}>
        <div className={classes.aboutContent}>
          <div className={classes.aboutName}>
            <img className={classes.profilePic} src="https://github.com/mthorning.png" alt="Profile Photo" />
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
  objRef: MutableRefObject<HTMLDivElement | null>;
}) {
  const location = useLocation();
  const search = new URLSearchParams(location.search)

  const [currentView, setCurrentView] = useState<'about' | 'links'>(
    search.get('view') === 'links' ? 'links' : 'about'
  );

  const toggleView = () => {
    setCurrentView((prev) => (prev === 'about' ? 'links' : 'about'));
  };

  return (
    <div
      ref={objRef}
      className={clsx(classes.perspectiveContainer, {
        [classes.showAbout]: currentView === 'about',
        [classes.showLinks]: currentView === 'links',
      })}
    >
      <div className={clsx(classes.box, classes.links)} >
        <LinksCard toggle={toggleView} />
      </div>
      <div className={clsx(classes.box, classes.about)} >
        <button type="button" className={clsx(classes.linkButton, classes.hamburgerButton)} onClick={toggleView}>
          <FaBars />
        </button>
        <About />
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
