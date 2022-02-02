import Control from '../../controls/control';
import Footer from '../mainPage/footer';

export default class AudioCallGameSection extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'audio-call-game-section', 'test audio-call-game');
    document.body.lastChild.remove();
  }

  destroy() {
    super.destroy();
    new Footer(document.body);
  }
}
