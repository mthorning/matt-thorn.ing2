import { useCallback, useEffect, useRef } from 'react';
import type { Canvas } from './useCanvas';

interface useTickArgs {
  context: CanvasRenderingContext2D | null;
  canvas: Canvas | null;
  onTick: () => void;
  tickLength: number;
}

interface useTickRtn {
  stopTick: () => void;
  restartTick: () => void;
}

export function useTick({
  context,
  onTick,
  tickLength,
  canvas,
}: useTickArgs): useTickRtn {
  const interval = useRef<NodeJS.Timeout>(null);

  const stopTick = () => {
    if (interval.current) clearInterval(interval.current);
  }

  const startTick = useCallback(() => {
    if (!context || !canvas) return;

    stopTick();
    interval.current = setInterval(() => {
      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      onTick();
    }, tickLength);
  }, [context, onTick]);

  useEffect(startTick, [startTick]);

  return {
    stopTick,
    restartTick: startTick,
  };
}
