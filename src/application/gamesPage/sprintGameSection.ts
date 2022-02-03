import Control from '../../controls/control';
import Footer from '../mainPage/footer';

export default class SprintGameSection extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'sprint-game-section', 'test sprint-game');
    document.body.lastChild.remove();
  }

  destroy() {
    super.destroy();
    new Footer(document.body);
  }
}
