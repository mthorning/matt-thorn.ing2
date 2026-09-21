import type { Canvas } from "../utils/useCanvas";

class Piece {
  context: CanvasRenderingContext2D;
  static squareWidth = 15;
  height: number;
  x: number;
  y: number;

  constructor(context: CanvasRenderingContext2D, x = 0, y = 0) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.height = Piece.squareWidth;
  }

  drawSquare() {
    const width = 15;
    const height = width;

    this.context.strokeRect(this.x, this.y, width, height);
  }

  draw() {
    this.drawSquare();
  }

}

export class Game {
  static gravity: number = 8;
  context: CanvasRenderingContext2D;
  canvas: Canvas;
  fallingPiece: Piece;
  pieces: Piece[] = [];
  baseLineWidth = 2;

  constructor(context: CanvasRenderingContext2D, canvas: Canvas) {
    this.context = context;
    this.canvas = canvas;
    this.fallingPiece = this.newFallingPiece();
    this.context.strokeStyle = '#fff';
  }

  newFallingPiece() {
    const centerX = this.canvas.width / 2;
    const x = centerX - Piece.squareWidth / 2;
    return new Piece(this.context, x)
  }

  draw() {
    this.drawBoard();
    this.fallingPiece.draw();
    this.fallingPiece.y += Game.gravity;

    const ground = this.canvas.height - this.baseLineWidth;
    if (this.fallingPiece.y >= ground - this.fallingPiece.height ) {
      this.pieces.push(new Piece(this.context, this.fallingPiece.x, ground - this.fallingPiece.height));
      this.fallingPiece = this.newFallingPiece();
    }
  }

  drawBoard() {
    this.drawBaseLine();
    this.drawPieces();
  }

  drawBaseLine() {
    const ctx = this.context

    ctx.lineWidth = this.baseLineWidth;

    ctx.beginPath();
    ctx.moveTo(0, this.canvas.height);
    ctx.lineTo(this.canvas.width, this.canvas.height);
    ctx.stroke();
  }

  drawPieces() {
    this.pieces.forEach(piece => piece.draw());
  }
}

