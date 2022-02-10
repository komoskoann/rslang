import Control from '../../controls/control';
import Avatar from './avatar';
import '../../css/header.css';

export default class Header extends Control {
  authorizationButton: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'header', 'header', '');
    const authorizationWrapper = new Control(this.node, 'div', 'authorizationWrapper');
    this.authorizationButton = new Control(authorizationWrapper.node, 'button', 'btn login', 'Войти');
  }
}
