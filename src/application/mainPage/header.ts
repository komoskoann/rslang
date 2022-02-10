import Control from '../../controls/control';
import Avatar from './avatar';
import '../../css/header.css';

export default class Header extends Control {
  avatar: Avatar;

  authorizationButton: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'header', 'header', '');
    const authorizationWrapper = new Control(this.node, 'div', 'authorizationWrapper');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // if(user) {
    //   this.avatar = new Avatar(authorizationWrapper.node, user.name[0]);
    // }
    // this.avatar = new Avatar(authorizationWrapper.node, 'A');
    this.authorizationButton = new Control(authorizationWrapper.node, 'button', 'btn login', 'Войти');
  }
}
