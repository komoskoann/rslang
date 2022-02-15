import Control from '../../controls/control';
import '../../css/header.css';
import AuthorizationForm from '../autorizationForm/autorizationForm';

export default class Header extends Control {
  authorizationButton: Control<HTMLElement>;

  autorizationForm: AuthorizationForm;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'header', 'header', '');
    const authorizationWrapper = new Control(this.node, 'div', 'authorizationWrapper');
    this.authorizationButton = new Control(authorizationWrapper.node, 'button', 'btn login', 'Войти');
    this.autorizationForm = new AuthorizationForm(this.node);
  }
}
