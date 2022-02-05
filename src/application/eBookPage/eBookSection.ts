import Control from '../../controls/control';
import eBook from './eBook.html';
import '../../css/eBook.css';

export default class EBookSection extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
  }
}
