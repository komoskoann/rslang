import Control from '../../../controls/control';
import '../../../css/audioChallege.css';
import audioChallengeStartPage from './audioChallengeStartPage';

export default class AudioCallGameSection extends Control {
  isReloadRequired: boolean = false;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'audio-challenge-wrapper', '');
    new audioChallengeStartPage(this.node);
  }

  destroy() {
    super.destroy();
  }
}
