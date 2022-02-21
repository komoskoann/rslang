import audioCallSGameStartHTML from './audioChallengeStartPage.html';
import Control from '../../../controls/control';
import '../../../css/audioChallege.css';
import audioChallengeGamePage from './audioChallengeGamePage';
import { IWordCard } from '../../eBookPage/ebookInterface';
import WordsController from '../../services/words/wordsController';
import '../../../css/preloader.css';
import preloadHtml from '../../eBookPage/preloader.html';

export default class audioChallengeStartPage extends Control {
  private startgameButton: HTMLButtonElement;

  private group: number;

  private page: number;

  service: WordsController = new WordsController();

  constructor(parentNode: HTMLElement, group: number, page: number) {
    super(parentNode, 'div', 'audio-challenge-container', '');
    this.node.innerHTML = audioCallSGameStartHTML;
    this.startgameButton = this.node.querySelector('.audio-challenge__start-button');
    this.group = group;
    this.page = page;
    this.navLevels();
    this.addEventListeners();
    this.checkEbookLevel();
  }

  private checkEbookLevel = (): void => {
    if (this.group) {
      this.node.querySelectorAll('.audio-game__level-button').forEach((button) => {
        if (+button.getAttribute('data-level') === this.group) {
          button.classList.add('active');
          this.startgameButton.disabled = false;
        }
      });
    }
  };

  private navLevels = (): void => {
    this.node.querySelectorAll('.audio-challenge__level-button').forEach((button) => {
      button.addEventListener('click', () => {
        this.node.querySelectorAll('.audio-challenge__level-button').forEach((item) => {
          if (item != button) item.classList.remove('active');
        });
        button.classList.toggle('active');
        this.startgameButton.disabled = button.classList.contains('active') ? false : true;
        this.group = +button.getAttribute('data-level');
        this.page = Math.round(Math.random() * 30);
      });
    });
  };

  private startGame = async (): Promise<void> => {
    if (!this.startgameButton.disabled) {
      const preloader = document.createElement('div');
      preloader.className = 'loader-wrapper';
      preloader.innerHTML = preloadHtml;
      this.node.append(preloader as HTMLElement);
      const words: IWordCard[] = await this.service.getWords(this.page, this.group);
      new audioChallengeGamePage(this.node, words);
      this.destroy();
    }
  };

  private addEventListeners = (): void => {
    this.startgameButton.addEventListener('click', this.startGame);
  };
}
