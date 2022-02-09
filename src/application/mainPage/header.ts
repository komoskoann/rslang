import Control from '../../controls/control';
import Avatar from './avatar';
import '../../css/avatar.css';

export default class Header extends Control {
  avatar: Avatar;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'header', 'header', '');
    this.avatar = new Avatar(this.node, 'A');
  }
}
