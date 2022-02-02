import Control from '../../controls/control';

export default class MainSection extends Control {
  toAuthorizationButton: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'main-section', 'test main-section');
    this.toAuthorizationButton = new Control(this.node, 'button', 'nav-button', 'to Authorization');
    this.toAuthorizationButton.node.id = 'authorization';
  }
}
