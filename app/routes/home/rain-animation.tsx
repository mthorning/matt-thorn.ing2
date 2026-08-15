"use client";
import { useEffect, useRef, type MutableRefObject } from "react";
import { colours } from "~/css-vars";
import { useColourScheme } from "~/hooks";

export default function RainAnimation({
  objRef,
}: {
  objRef: MutableRefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colourScheme] = useColourScheme();

  useEffect(() => {
    if (!canvasRef?.current) return;

    const context = canvasRef.current.getContext("2d");
    let objCoords: DOMRect | undefined;

    function setCoords() {
      objCoords = objRef?.current?.getBoundingClientRect();
    }

    function setSize() {
      if (canvasRef.current) {
        canvasRef.current.height = innerHeight;
        canvasRef.current.width = innerWidth;
      }
      setCoords();
    }
    window.addEventListener("resize", () => setSize());
    window.addEventListener("scroll", () => setCoords());
    setSize();

    if (!context) throw new Error("No context");

    const cols = colours[colourScheme];

    class RainDrop {
      static baseColour = cols.neutral;
      static highlightColours = [cols.primary, cols.secondary];

      x: number = 0;
      y: number = 0;
      gravity: number = 0;
      rainDropTrailWidth: number = 2;
      strokeColor: string = cols.neutral;
      hasFallen: boolean = false;

      constructor() {
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
        if (!context) throw new Error("No context");
        context.beginPath();
        context.lineWidth = this.rainDropTrailWidth;
        context.strokeStyle = this.strokeColor;

        const splashY = objCoords
          ? this.x > objCoords.left && this.x < objCoords.right
            ? objCoords.top + window.scrollY
            : undefined
          : window.scrollY;

        if (this.gravity > 3 && splashY && this.y + this.gravity >= splashY) {
          this.y = splashY;
          this.splash(splashY);
        } else {
          context.moveTo(this.x, this.y);
          this.y += this.gravity;
          context.lineTo(this.x, this.y);
          context.stroke();
          this.hasFallen = this.y >= innerHeight;
        }
      }

      generateColor(): string {
        const rnd = Math.floor(Math.random() * 10);
        return RainDrop.highlightColours[rnd] ?? RainDrop.baseColour;
      }

      splash(splashY: number) {
        if (!context) throw new Error("No context");
        const rnd = (Math.random() * this.gravity) / 5;
        context.moveTo(this.x, splashY);
        context.lineTo(this.x - rnd * 6, splashY - rnd * 3);
        context.stroke();
        context.moveTo(this.x, splashY);
        context.lineTo(this.x + rnd * 6, splashY - rnd * 3);
        context.stroke();
        this.hasFallen = true;
      }
    }

    class Cloud {
      rainDrops: RainDrop[] = [];
      fallingDrops: RainDrop[] = [];
      maxFallingDrops: number;
      isRaining: boolean = true;

      constructor(initialRainDrops: number, maxFallingDrops: number) {
        this.maxFallingDrops = maxFallingDrops;
        for (let i = 0; i < initialRainDrops; i++) {
          this.rainDrops.push(new RainDrop());
        }
      }

      dropRainDrop() {
        this.fallingDrops.push(this.rainDrops.pop() as RainDrop);
      }

      rain() {
        if (!context) throw new Error("No context");
        if (this.fallingDrops.length < this.maxFallingDrops && this.isRaining) {
          this.dropRainDrop();
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
    }

    const cloud = new Cloud(Math.max(window.innerWidth, 1200), 500);

    const interval = setInterval(() => {
      context.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      cloud.rain();
    }, 15);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", () => setSize());
      window.removeEventListener("scroll", () => setCoords());
    };
  }, [objRef, colourScheme]);

  return <canvas ref={canvasRef} />;
}
