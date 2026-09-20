import type { RainDrop } from './raindrop';

export class Cloud {
  rainDrops: RainDrop[] = [];
  fallingDrops: RainDrop[] = [];
  maxFallingDrops: number;
  initialMaxFallingDrops: number;
  context: CanvasRenderingContext2D;
  onRainStop: () => void;

  constructor(initialRainDrops: number, maxFallingDrops: number, makeNewRainDrop: () => RainDrop, context: CanvasRenderingContext2D, onRainStop: () => void) {
    this.context = context;
    this.maxFallingDrops = maxFallingDrops;
    this.initialMaxFallingDrops = maxFallingDrops;
    this.onRainStop = onRainStop;
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

    if (this.fallingDrops.length === 0) {
      this.onRainStop();
    }
  }

  stopRain() {
    this.maxFallingDrops = 0;
  }

  restartRain() {
    this.maxFallingDrops = this.initialMaxFallingDrops;
  }
}

