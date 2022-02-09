import Control from '../../controls/control';
import '../../css/firstPage.css';
import '/src/global.css';
import firstPage from './main-page.html';
import AuthorizationForm from '../autorizationForm/autorizationForm';

export default class MainSection extends Control {
  autorizationForm: AuthorizationForm;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'main-section', '');
    this.node.innerHTML = firstPage;
    this.autorizationForm = new AuthorizationForm(this.node);
  }
}
