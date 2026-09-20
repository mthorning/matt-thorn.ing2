import { useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';

export default function Tetris() {
  const { canvasRef, context, stopTick } = useCanvas(
    {
    tickLength: 20,
    onTick() {
      //todo
    },
  });

  useEffect(() => stopTick, []);


  return <canvas ref={canvasRef} />;
}
