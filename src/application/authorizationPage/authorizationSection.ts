import Control from '../../controls/control';

export default class AuthorizationSection extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'authorization-section', 'test authorization');
  }
}
