import Control from '../../controls/control';
import '../../css/firstPage.css';
import '/src/global.css';
import firstPage from './main-page.html';

export default class MainSection extends Control {
  toAuthorizationButton: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'main-section', '');
    this.node.innerHTML = firstPage;
  }
}
