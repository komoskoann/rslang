import audioCallSGameStartHTML from './audioChallengeStartPage.html';
import Control from '../../../controls/control';
import '../../../css/audioChallege.css';
import Footer from '../../mainPage/footer';
import LocalStorage from '../../services/words/localStorage';

export default class AudioChallengeStartPage extends Control {
  LocalStorage: LocalStorage = new LocalStorage();

  private startgameButton: HTMLButtonElement;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'audio-challenge-container', '');
    document.querySelector('.footer')?.remove();
    this.node.innerHTML = audioCallSGameStartHTML;
    this.startgameButton = this.node.querySelector('.audio-challenge__start-button');
    this.LocalStorage.setToLocalStorage('audiochallenge-group', String(Math.round(Math.random() * 5)));
    this.LocalStorage.setToLocalStorage('audiochallenge-page', String(Math.round(Math.random() * 29)));
    this.navLevels();
  }

  private navLevels = (): void => {
    this.node.querySelectorAll('.audio-challenge__level-button').forEach((button) => {
      button.addEventListener('click', () => {
        this.node.querySelectorAll('.audio-challenge__level-button').forEach((item) => {
          if (item != button) item.classList.remove('active');
        });
        button.classList.toggle('active');
        this.startgameButton.disabled = button.classList.contains('active') ? false : true;
        this.LocalStorage.setToLocalStorage('audiochallenge-group', button.getAttribute('data-level'));
        this.LocalStorage.setToLocalStorage('audiochallenge-page', String(Math.round(Math.random() * 29)));
      });
    });
  };

  destroy() {
    super.destroy();
    new Footer(document.body);
  }
}
