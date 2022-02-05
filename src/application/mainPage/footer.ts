import Control from '../../controls/control';
import footer from './footer.html';

export default class Footer extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'footer', 'footer', '');
    this.node.innerHTML = footer;
  }
}
