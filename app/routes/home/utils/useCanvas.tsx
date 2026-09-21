import { useRef, type RefObject } from 'react';

export type Canvas = Record<'width' | 'height', number>;

interface useCanvasRtn {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canvas: Canvas | null;
  context: CanvasRenderingContext2D | null;
}

export function useCanvas(): useCanvasRtn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current?.getContext('2d') ?? null;

  const canvas = canvasRef.current && canvasRef.current.width && canvasRef.current.height ?  {
      width: canvasRef.current.width,
      height: canvasRef.current.height,
  } : null;

  return {
    context,
    canvasRef,
    canvas,
  };
}
