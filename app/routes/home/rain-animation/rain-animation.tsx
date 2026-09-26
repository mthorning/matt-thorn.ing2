import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import { colours } from '~/styles/css-vars';
import { useColourScheme } from '~/hooks';
import { Cloud } from './cloud';
import { RainDrop } from './raindrop';
import { useCanvas } from '../utils/useCanvas';
import { useTick } from '../utils/useTick';

export default function RainAnimation({
  objRef,
  isRaining,
}: {
  objRef: RefObject<HTMLElement | null>;
  isRaining: boolean;
}) {
  const [colourScheme] = useColourScheme();

  const [objCoords, setObjCoords] = useState<DOMRect | undefined>();
  useEffect(() => {
    function setCoords() {
      setObjCoords(objRef?.current?.getBoundingClientRect());
    }

    function setSize() {
      if (canvasRef.current) {
        canvasRef.current.height = innerHeight;
        canvasRef.current.width = innerWidth;
      }
      setCoords();
    }
    window.addEventListener('resize', () => setSize());
    window.addEventListener('scroll', () => setCoords());
    setSize();

    return () => {
      window.removeEventListener('resize', () => setSize());
      window.removeEventListener('scroll', () => setCoords());
    };
  }, [setObjCoords]);

  const { canvas, canvasRef, context } = useCanvas();

  const onRainStop = () => {
    stopTick();
  };

  const cloud = useMemo(() => {
    if (!context) return;
    const cols = colours[colourScheme];

    const makeNewRainDrop = () => new RainDrop(cols, context, objCoords);
    return new Cloud(
      Math.max(window.innerWidth, 1200),
      500,
      makeNewRainDrop,
      context,
      onRainStop
    );
  }, [objCoords, context, colourScheme]);

  const onTick = useCallback(() => {
    cloud?.rain();
  }, [cloud]);

  const { stopTick, startTick } = useTick({
    context,
    canvas,
    tickLength: 20,
    onTick,
  });

  useEffect(() => {
    startTick();
    return stopTick
  }, [startTick, stopTick]);


  useEffect(() => {
    if (isRaining && cloud?.maxFallingDrops === 0) {
      startTick();
      cloud.restartRain();
    }
    if (!isRaining && cloud?.maxFallingDrops !== 0) {
      cloud?.stopRain();
    }
  }, [isRaining, cloud]);

  return <canvas ref={canvasRef} />;
}
