import { Canvas, GlobalFonts } from "@napi-rs/canvas";
import { join, dirname } from "path";
export class WordGraphicBuilder {
  wordGuesses: string[];
  secretWord: string[];
  BOX_SIZE: number;
  BOX_CURVE: number;
  BOX_PADDING_X: number;
  BOX_PADDING_Y: number;
  FONT_NAME: string;
  FONT_SIZE: number;
  BG_COLOR: string;
  EMPTY_COLOR: string;
  CORRECT_COLOR: string;
  MISMATCH_COLOR: string;
  MISSING_COLOR: string;
  UNKNOWN_COLOR: string;
  TEXT_COLOR: string;
  constructor(secretWord: string) {
    this.BOX_SIZE = 58;
    this.BOX_CURVE = 4;
    this.BOX_PADDING_X = 3;
    this.BOX_PADDING_Y = 3;
    this.FONT_NAME = "NeueHelveticaBQ-Bold.otf";
    this.FONT_SIZE = 40;
    this.BG_COLOR = "#121213";
    this.EMPTY_COLOR = "#121213";
    this.CORRECT_COLOR = "#538d4e";
    this.MISMATCH_COLOR = "#b59f3b";
    this.MISSING_COLOR = "#3a3a3c";
    this.UNKNOWN_COLOR = "#3a3a3c";
    this.TEXT_COLOR = "#ffffff";
    this.wordGuesses = new Array();
    this.secretWord = Array.from(secretWord);
    const __dirname = dirname(new URL(import.meta.url).pathname);
    GlobalFonts.registerFromPath(join(__dirname, "..", "fonts", this.FONT_NAME), "NS");
  }

  addWordGuesses(wordGuesses: string) {
    this.wordGuesses.push(wordGuesses);
  }

  buildAsBufferedImage() {
    const canvas = new Canvas(356, 412);
    const ctx = canvas.getContext("2d");
    ctx.font = `${this.FONT_SIZE}px NS`;
    ctx.fillStyle = this.BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gridWidth = this.BOX_PADDING_X * 2 + this.BOX_SIZE;
    const gridHeight = this.BOX_PADDING_Y * 2 + this.BOX_SIZE;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const letterGuess = this.wordGuesses[row] ? this.wordGuesses[row][col] : null;
        const startX = gridWidth * col + this.BOX_PADDING_X;
        const startY = gridHeight * row + this.BOX_PADDING_Y;
        const letterPosition = this.secretWord.indexOf(letterGuess);
        if (!letterGuess) {
          ctx.strokeStyle = this.UNKNOWN_COLOR;
          ctx.lineWidth = 2;
          ctx.strokeRect(startX + 18, startY + 14, this.BOX_SIZE, this.BOX_SIZE);
        } else {
          if (letterPosition === -1) {
            ctx.fillStyle = this.UNKNOWN_COLOR;
            ctx.fillRect(startX + 18, startY + 14, this.BOX_SIZE, this.BOX_SIZE);
          } else if (this.secretWord[col] === letterGuess) {
            ctx.fillStyle = this.CORRECT_COLOR;
            ctx.fillRect(startX + 18, startY + 14, this.BOX_SIZE, this.BOX_SIZE);
          } else {
            ctx.fillStyle = this.MISMATCH_COLOR;
            ctx.fillRect(startX + 18, startY + 14, this.BOX_SIZE, this.BOX_SIZE);
          }
        }
        if (letterGuess) {
          const metrics = ctx.measureText(letterGuess.toUpperCase());
          const textStartX = startX + 18 + (this.BOX_SIZE - metrics.width) / 2;
          const textStartY = startY + 14 + (this.BOX_SIZE - this.FONT_SIZE) * 2.35;
          ctx.fillStyle = this.TEXT_COLOR;
          ctx.fillText(letterGuess.toUpperCase(), textStartX, textStartY);
        }
      }
    }
    return canvas.encode("png");
  }
}
