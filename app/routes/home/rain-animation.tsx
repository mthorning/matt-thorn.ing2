import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { colours } from '~/styles/css-vars';
import { useColourScheme } from '~/hooks';

type Cols = typeof colours[keyof typeof colours];

class RainDrop {
  x: number = 0;
  y: number = 0;
  gravity: number = 0;
  hasFallen: boolean = false;
  baseColour: string;
  highlightColours: string[];
  rainDropTrailWidth: number = 2;
  strokeColor: string;
  context: CanvasRenderingContext2D | null;
  objCoords: DOMRect | undefined;

  constructor(
    cols: Cols,
    context: CanvasRenderingContext2D | null,
    objCoords: DOMRect | undefined
  ) {
    this.baseColour = cols.neutral;
    this.highlightColours = [cols.primary, cols.secondary];
    this.strokeColor = cols.neutral;
    this.context = context;
    this.objCoords = objCoords;
    this.init();
  }

  init() {
    this.y = 0;
    this.x = Math.random() * innerWidth;
    this.gravity = Math.random() * 10;
    this.hasFallen = false;
    this.strokeColor = this.generateColor();
  }

  fall() {
    if (!this.context) throw new Error('No context');
    this.context.beginPath();
    this.context.lineWidth = this.rainDropTrailWidth;
    this.context.strokeStyle = this.strokeColor;

    const splashY = this.objCoords
      ? this.x > this.objCoords.left && this.x < this.objCoords.right
        ? this.objCoords.top + window.scrollY
        : undefined
      : window.scrollY;

    if (this.gravity > 3 && splashY && this.y + this.gravity >= splashY) {
      this.y = splashY;
      this.splash(splashY - 5); //random 5px diff added here :shrug:
    } else {
      this.context.moveTo(this.x, this.y);
      this.y += this.gravity;
      this.context.lineTo(this.x, this.y);
      this.context.stroke();
      this.hasFallen = this.y >= innerHeight;
    }
  }

  generateColor(): string {
    const rnd = Math.floor(Math.random() * 10);
    return this.highlightColours[rnd] ?? this.baseColour;
  }

  splash(splashY: number) {
    if (!this.context) throw new Error('No context');
    const rnd = (Math.random() * this.gravity) / 5;
    this.context.moveTo(this.x, splashY);
    this.context.lineTo(this.x - rnd * 6, splashY - rnd * 3);
    this.context.stroke();
    this.context.moveTo(this.x, splashY);
    this.context.lineTo(this.x + rnd * 6, splashY - rnd * 3);
    this.context.stroke();
    this.hasFallen = true;
  }
}

class Cloud {
  rainDrops: RainDrop[] = [];
  fallingDrops: RainDrop[] = [];
  maxFallingDrops: number;
  initialMaxFallingDrops: number;
  context: CanvasRenderingContext2D;

  constructor(initialRainDrops: number, maxFallingDrops: number, makeNewRainDrop: () => RainDrop, context: CanvasRenderingContext2D) {
    this.context = context;
    this.maxFallingDrops = maxFallingDrops;
    this.initialMaxFallingDrops = maxFallingDrops;
    for (let i = 0; i < initialRainDrops; i++) {
      this.rainDrops.push(makeNewRainDrop());
    }
  }

  rain() {
    if (!this.context) throw new Error('No context');
    if (this.fallingDrops.length < this.maxFallingDrops) {
      this.fallingDrops.push(this.rainDrops.pop() as RainDrop);
    }

    this.fallingDrops.forEach((rainDrop, i) => {
      rainDrop.fall();
      if (rainDrop.hasFallen) {
        this.fallingDrops.splice(i, 1);
        rainDrop.init();
        this.rainDrops.push(rainDrop);
      }
    });
  }

  stopRain() {
    this.maxFallingDrops = 0;
  }

  restartRain() {
    this.maxFallingDrops = this.initialMaxFallingDrops;
  }
}

export default function RainAnimation({
  objRef,
  isRaining,
}: {
  objRef: RefObject<HTMLElement | null>;
  isRaining: boolean;
}) {
  const [colourScheme] = useColourScheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current?.getContext('2d') ?? null;

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

  const cloud = useMemo(() => {
    if (!context) return;
    const cols = colours[colourScheme];

    const makeNewRainDrop = () => new RainDrop(cols, context, objCoords)
    return new Cloud(Math.max(window.innerWidth, 1200), 500, makeNewRainDrop, context);
  }, [objCoords, context, colourScheme])

  useEffect(() => {
    if (!context) return;

    const interval = setInterval(() => {
      context.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      cloud?.rain();
    }, 15);

    return () => {
      clearInterval(interval);
    };
  }, [context, cloud]);

  useEffect(() => {
    if(isRaining && cloud?.maxFallingDrops === 0) {
      cloud.restartRain();
    }
    if(!isRaining && cloud?.maxFallingDrops !== 0) {
      cloud?.stopRain();
    }
  }, [isRaining, cloud])

  return <canvas ref={canvasRef} />;
}
