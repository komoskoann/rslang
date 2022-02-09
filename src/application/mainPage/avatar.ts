import Control from '../../controls/control';

export default class Avatar extends Control {
  lettersColor: string = '#ffffff';

  backgroundColor: string = '#42cdff';

  canvasWidth: number = 50;

  canvasHeight: number = 50;

  canvas: HTMLCanvasElement;

  context: CanvasRenderingContext2D;

  name: string;

  constructor(parentNode: HTMLElement, name: string) {
    super(parentNode, 'img', 'avatar-img');
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.name = name;
    (this.node as HTMLImageElement).src = this.renderAvatar();

  }

  renderAvatar() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.font = '6rem Sans-serif';
    this.context.fillStyle = this.lettersColor;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.name, this.canvas.width / 2, this.canvas.height / 2);
    return this.canvas.toDataURL('image/png');
  }


}
