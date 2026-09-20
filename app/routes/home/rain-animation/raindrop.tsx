import { colours } from '~/styles/css-vars';

type Cols = typeof colours[keyof typeof colours];

export class RainDrop {
  x: number = 0;
  y: number = 0;
  gravity: number = 0;
  hasFallen: boolean = false;
  baseColour: string;
  highlightColours: string[];
  rainDropTrailWidth: number = 1;
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
    this.gravity = Math.max(0.2, Math.random()) * 10;
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

    if (this.gravity > 4 && splashY && this.y + this.gravity >= splashY) {
      this.y = splashY;
      this.splash(splashY - 5); //random 5px diff added here :shrug:
    } else {
      this.context.moveTo(this.x, this.y);
      this.y += this.gravity / 1.5;
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
    this.context.lineTo(this.x - rnd * 4, splashY - rnd * 3);
    this.context.stroke();
    this.context.moveTo(this.x, splashY);
    this.context.lineTo(this.x + rnd * 4, splashY - rnd * 3);
    this.context.stroke();
    this.hasFallen = true;
  }
}
