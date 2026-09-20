import { useCallback, useEffect, useRef, type RefObject } from 'react';

interface useCanvasArgs {
  onTick: () => void;
  tickLength: number;
}

interface useCanvasRtn {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  context: CanvasRenderingContext2D | null;
  stopTick: () => void;
  restartTick: () => void;
}

export function useCanvas({
  onTick,
  tickLength,
}: useCanvasArgs): useCanvasRtn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current?.getContext('2d') ?? null;
  const interval = useRef<NodeJS.Timeout>(null);

  const stopTick = () => {
    if (interval.current) clearInterval(interval.current);
  }

  const startTick = useCallback(() => {
    if (!context) return;

    stopTick();
    interval.current = setInterval(() => {
      context.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      console.log('tick')
      onTick();
    }, tickLength);
  }, [context, onTick]);

  useEffect( startTick, [startTick]);

  return {
    context,
    canvasRef,
    stopTick,
    restartTick: startTick,
  };
}
