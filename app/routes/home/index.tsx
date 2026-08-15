import { useRef, type MutableRefObject, type ComponentProps, useState } from 'react';
import clsx from 'clsx';
import RainAnimation from './rain-animation';
import { constants } from '~/css-vars';
import classes from './home.module.css';
import { FaGithub, FaLinkedin, FaBluesky } from 'react-icons/fa6';

function A(props: ComponentProps<'a'>) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

function LinksCard({ toggle }: { toggle: () => void }) {
  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <h1>Welcome</h1>
        <h3>It&apos;s not much, but it&apos;s home</h3>
      </div>
      <div className={classes.cardContent}>
        <button type="button" onClick={toggle}>About</button>
      </div>
      <div className={classes.cardFooter}>
      </div>
    </div>
  );
}

function About({ toggle }: { toggle: () => void }) {
  return (
    <div className={classes.card}>
      <div className={classes.cardContent}>
        <div className={classes.aboutContent}>
          <div className={classes.aboutName}>
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
              {/* <button onClick={() => goBack()}>flip</button> */}
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
        <button type="button" onClick={toggle}>Links</button>
      </div>
    </div>
  );
}

function BusinessCard({
  objRef,
}: {
  objRef: MutableRefObject<HTMLDivElement | null>;
}) {
  const [currentView, setCurrentView] = useState<'about' | 'links'>('about');
  const toggleView = () => {
    setCurrentView((prev) => (prev === 'about' ? 'links' : 'about'));
  };

  return (
    <div
      className={clsx(classes.perspectiveContainer, {
        [classes.showAbout]: currentView === 'about',
        [classes.showLinks]: currentView === 'links',
      })}
    >
      <div
        ref={currentView === 'links' ? objRef : null}
        className={clsx(classes.box, classes.links)}
      >
        <LinksCard toggle={toggleView} />
      </div>
      <div
        ref={currentView === 'about' ? objRef : null}
        className={clsx(classes.box, classes.about)}
      >
        <About toggle={toggleView} />
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
