import {
  useEffect,
  useMemo,
} from 'react';
import { useCanvas } from '../utils/useCanvas';
import { useTick } from '../utils/useTick';
import { useContainer } from '../utils/useContainer';
import classes from './tetris.module.css';
import { Game } from './game';

export default function Tetris() {
  const { canvasRef, canvas, context } = useCanvas();

  const game = useMemo(() => {
    if (canvas == null || context == null) return null;

    return new Game(context, {
      width: canvas.width,
      height: canvas.height
    });
  }, [canvas, context]);

  const { stopTick } = useTick({
    canvas,
    context,
    tickLength: 50,
    onTick() {
      if (game) {
        game.draw();
      }
    },
  });


  useEffect(() => stopTick, []);

  const [containerRef, containerWidth, containerHeight] = useContainer();
  return (
    <div
      ref={containerRef}
      className={classes.container}
    >
      <canvas
        ref={canvasRef}
        width={containerWidth}
        height={containerHeight}
      />
    </div>
  );
}
