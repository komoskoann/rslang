import Control from '../../controls/control';
import '../../css/firstPage.css';
import '/src/global.css';
import firstPage from './main-page.html';

export default class MainSection extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'main-section', '');
    this.node.innerHTML = firstPage;
  }
}
