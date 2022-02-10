import Control from '../../controls/control';

export default class Avatar extends Control {
  private lettersColor: string = '#ffffff';

  private backgroundColor: string;

  private canvas: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  private name: string;

  constructor(parentNode: HTMLElement, name: string) {
    super(parentNode, 'img', 'avatar-img', '', true);
    this.canvas = document.createElement('canvas');
    this.name = name;
    this.generateRandomColor();
    this.setCanvasElementProperties();
    (this.node as HTMLImageElement).src = this.canvas.toDataURL('image/png');
  }

  private setCanvasElementProperties() {
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.font = '6rem Sans-serif';
    this.context.fillStyle = this.lettersColor;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.name, this.canvas.width / 2, this.canvas.height / 2);
  }

  private generateRandomColor(): string {
    const possibleHexColorSymbols: string = '0123456789ABCDEF';
    const hexColorLength: number = 6;
    this.backgroundColor = '#';
    for (let i = 0; i < hexColorLength; i++) {
      this.backgroundColor += possibleHexColorSymbols[Math.floor(Math.random() * possibleHexColorSymbols.length)];
    }
    return this.backgroundColor;
  }
}
