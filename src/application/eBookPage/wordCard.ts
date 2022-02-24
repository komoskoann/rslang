import Control from '../../controls/control';
import '../../css/word.css';
import '../../css/popUp.css';
import { IWordCard } from './ebookInterface';
import WordsController from '../services/words/wordsController';
import { app } from '../..';
import EBookSection from './eBookSection';
import wordStats from './wordStats.html';
import { getAuthorizedUser } from '../services/authorizationService/authorizedUser';

export interface IPlayList {
  title: string;
  src: string;
}

export default class WordCard extends Control {
  private cardInfoWrapper: Control<HTMLElement>;

  service: WordsController = new WordsController();

  private audio: HTMLAudioElement;

  private isDifficult: boolean;

  private playButton: Control<HTMLElement>;

  private difficultWordButton: Control<HTMLElement>;

  private learntWordButton: Control<HTMLElement>;

  private isLearnt: boolean;

  private wordCardInfo: IWordCard;

  private playList: IPlayList[];

  private playNum: number = 0;

  private container: Control<HTMLElement>;

  private serverURL: string = 'https://rslangapplication.herokuapp.com/';

  private isPlaying: boolean = false;

  private difficultWordClassName: string = 'difficult-word-card';

  private learntWordClassName: string = 'learnt-word-card';

  private controlButtonsWrapper: Control<HTMLElement>;

  callBack: (a: string, b: string) => void;

  private gameStatsButton: Control<HTMLElement>;

  constructor(parentNode: HTMLElement, wordCardInfo: IWordCard, callBack: (a: string, b: string) => void) {
    super(parentNode, 'div', 'word-card-wrapper', '');
    this.container = new Control(this.node, 'div');
    this.isDifficult = !!wordCardInfo.userWord?.optional?.isDifficult;
    if (this.isDifficult) {
      this.node.classList.add(this.difficultWordClassName);
    }
    this.isLearnt = !!wordCardInfo.userWord?.optional?.isLearnt;
    if (this.isLearnt) {
      this.node.classList.add(this.learntWordClassName);
    }
    this.wordCardInfo = wordCardInfo;
    this.callBack = callBack;
  }

  render(): void {
    this.node.id = this.getId();
    this.renderCardNameWrapper();
    this.renderCardImage();
    this.renderCardInfoWrapper();
    this.renderCardMeaningWrapper();
    this.renderCardExampleWrapper();
    this.renderControlButtons();
    this.renderToggleButtons();
    this.renderEngLevelMark();
    this.renderWordGameStats();
    this.listenEvents();
  }

  private getId() {
    return this.wordCardInfo.id;
  }

  private renderCardNameWrapper(): void {
    const cardNameWrapper = new Control(this.container.node, 'div', 'card-name-wrapper');
    const cardTitle = new Control(cardNameWrapper.node, 'div', 'card-title-wrapper');
    this.playButton = new Control(cardTitle.node, 'button', 'play-button');
    new Control(cardTitle.node, 'span', 'word-name', this.wordCardInfo.word);
    const cardName = new Control(cardNameWrapper.node, 'div', 'card-name');
    new Control(cardName.node, 'span', 'word-transcription', `${this.wordCardInfo.transcription}`);
    const translation = new Control(cardName.node, 'span', 'word-translation', `${this.wordCardInfo.wordTranslate}`);
    this.scaleSpan(cardNameWrapper, translation);
  }

  // Внимание! Увага! Alert! Аttention! Аchtung! Этот метод адаптирует font-size!
  private scaleSpan(container: Control<HTMLElement>, span: Control<HTMLElement>): void {
    const widthContainer = parseInt(getComputedStyle(container.node).width);
    let widthSpan = parseInt(getComputedStyle(span.node).width);
    let currentFontSize = parseFloat(getComputedStyle(span.node).fontSize);
    if (widthContainer < widthSpan) {
      while (widthContainer < widthSpan) {
        --currentFontSize;
        span.node.style.fontSize = `${currentFontSize}px`;
        widthSpan = parseInt(getComputedStyle(span.node).width);
      }
    }
  }

  private renderCardImage(): void {
    const cardImageWrapper = new Control(this.container.node, 'div', 'card-image-wrapper');
    cardImageWrapper.node.innerHTML = `<img src="${this.serverURL}${this.wordCardInfo.image}" alt="word image" class="card-image">`;
  }

  private renderCardInfoWrapper(): void {
    this.cardInfoWrapper = new Control(this.container.node, 'div', 'card-info-wrapper');
  }

  private renderCardMeaningWrapper(): void {
    const cardMeaningWrapper = new Control(this.cardInfoWrapper.node, 'div', 'card-meaning-wrapper');
    const wordMeaningEng = new Control(cardMeaningWrapper.node, 'span', 'word-meaning-eng');
    wordMeaningEng.node.innerHTML = this.wordCardInfo.textMeaning;
    new Control(cardMeaningWrapper.node, 'span', 'word-meaning-rus', this.wordCardInfo.textMeaningTranslate);
  }

  private renderCardExampleWrapper(): void {
    const cardExampleWrapper = new Control(this.cardInfoWrapper.node, 'div', 'card-example-wrapper');
    const wordExampleEng = new Control(cardExampleWrapper.node, 'span', 'word-example-eng');
    wordExampleEng.node.innerHTML = `→ ${this.wordCardInfo.textExample}`;
    new Control(cardExampleWrapper.node, 'span', 'word-example-rus', this.wordCardInfo.textExampleTranslate);
  }

  private renderControlButtons(): void {
    this.controlButtonsWrapper = new Control(this.node, 'div', 'control-buttons-wrapper');
    this.difficultWordButton = new Control(
      this.controlButtonsWrapper.node,
      'button',
      'difficult-word-button',
      this.isDifficult ? 'Легкое' : 'Сложное',
    );
    this.learntWordButton = new Control(this.controlButtonsWrapper.node, 'button', 'delete-word-button', 'Изученное');
  }

  private renderEngLevelMark() {
    const engLevelMark = new Control(this.node, 'div', 'eng-level-mark lev-desig');
    switch (EBookSection.currentEnglishLevel) {
      case 0:
        engLevelMark.node.innerHTML = 'A1';
        break;
      case 1:
        engLevelMark.node.innerHTML = 'A2';
        engLevelMark.node.classList.add('red');
        break;
      case 2:
        engLevelMark.node.innerHTML = 'B1';
        engLevelMark.node.classList.add('purple');
        break;
      case 3:
        engLevelMark.node.innerHTML = 'B2';
        engLevelMark.node.classList.add('deep-blue');
        break;
      case 4:
        engLevelMark.node.innerHTML = 'C1';
        engLevelMark.node.classList.add('green');
        break;
      case 5:
        engLevelMark.node.innerHTML = 'C2';
        engLevelMark.node.classList.add('blue');
        break;
    }
  }

  private renderWordGameStats() {
    if (getAuthorizedUser()) {
      const wordGameStatsWrapper = new Control(this.node, 'div', 'word-game-stats-wrapper');
      this.gameStatsButton = new Control(wordGameStatsWrapper.node, 'div', 'game-stats-button');
      const modalWrapper = new Control(wordGameStatsWrapper.node, 'div', 'modal-overlay');
      modalWrapper.node.id = 'simpleModal';
      modalWrapper.node.innerHTML = wordStats;
    }
  }

  private openModalStats() {
    document.getElementById('simpleModal').style.display = 'block';
  }

  private closeModalStats() {
    document.getElementById('simpleModal').style.display = 'none';
  }

  private closeModalStatsOutsideClick(e: Event) {
    if (e.target == document.getElementById('simpleModal')) {
      document.getElementById('simpleModal').style.display = 'none';
    }
  }

  private playAudio(): void {
    this.createPlaylist();
    if (!this.isPlaying || this.audio?.ended) {
      this.audio = new Audio();
      this.audio.src = this.playList[this.playNum].src;
      this.audio.play();
      this.isPlaying = true;
      this.audio.addEventListener('ended', this.getSongNext.bind(this));
    } else if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  private createPlaylist(): IPlayList[] {
    return (this.playList = [
      {
        title: 'example',
        src: `${this.serverURL}${this.wordCardInfo.audio}`,
      },
      {
        title: 'audioMeaning',
        src: `${this.serverURL}${this.wordCardInfo.audioMeaning}`,
      },
      {
        title: 'audioExample',
        src: `${this.serverURL}${this.wordCardInfo.audioExample}`,
      },
    ]);
  }

  private getSongNext(): void {
    this.isPlaying = !this.isPlaying;
    if (this.playNum != this.playList.length - 1) {
      this.playNum++;
      this.playAudio();
    } else {
      this.playNum = 0;
    }
  }

  async getUserWords(): Promise<void> {
    await this.service.getHardUserWords();
  }

  async createUserWord(wordId: string, word: { difficulty: string; optional: {} }): Promise<void> {
    const createdUserWordResponse = await this.service.createUserWord(wordId, word);
    if (createdUserWordResponse.status === 417) {
      this.updateUserWord(wordId, word);
    }
  }

  async updateUserWord(wordId: string, word: { difficulty: string; optional: {} }): Promise<void> {
    await this.service.changeUserWord(wordId, word);
  }

  async agregUserWord(wordId: string): Promise<void> {
    await this.service.getUserAgrWord(wordId);
  }

  private toggleToDifficult(): void {
    const popupsContainer = new Control(document.body, 'div', 'alert alert-info');
    const cardId = this.getId();
    if (!this.isDifficult) {
      this.node.querySelector('.difficult-word-button').classList.remove('disable-word-buttons');
      this.isDifficult = true;
      this.node.querySelector('.difficult-word-button').innerHTML = 'Легкое';
      this.node.classList.add(this.difficultWordClassName);
      popupsContainer.node.innerHTML = 'Добавлено в сложные слова';
      this.hideAlert(popupsContainer);
      this.createUserWord(cardId, {
        difficulty: 'hard',
        optional: {
          isDifficult: true,
          isLearnt: false,
          seriaLength: null,
          result: null,
          gameStatistic: { sprint: { right: 0, wrong: 0 }, audioCall: { right: 0, wrong: 0 } },
        },
      });
      this.callBack('difficult', '+');
      this.node.querySelector('.delete-word-button').classList.add('disable-word-buttons');
    } else if (this.isDifficult) {
      this.node.querySelector('.delete-word-button').classList.remove('disable-word-buttons');
      this.node.classList.remove(this.difficultWordClassName);
      this.node.querySelector('.difficult-word-button').innerHTML = 'Сложное';
      this.isDifficult = false;
      popupsContainer.node.innerHTML = 'Удалено из сложных слов';
      this.hideAlert(popupsContainer);
      this.updateUserWord(cardId, { difficulty: 'easy', optional: { isDifficult: false, isLearnt: false } });
      this.callBack('difficult', '-');
    }
    this.getUserWords();
  }

  hideAlert(currentNode: Control<HTMLElement>) {
    setTimeout(function () {
      currentNode.node.remove();
    }, 1000);
  }

  private toggleToLearnt(): void {
    const cardId = this.getId();
    this.agregUserWord(cardId);
    const popupsContainer = new Control(this.node, 'div', 'alert alert-info');
    if (!this.isLearnt) {
      this.isLearnt = true;
      this.node.querySelector('.delete-word-button').classList.remove('disable-word-buttons');
      this.node.classList.add(this.learntWordClassName);
      this.createUserWord(cardId, {
        difficulty: 'easy',
        optional: {
          isDifficult: false,
          isLearnt: true,
          seriaLength: null,
          result: null,
          gameStatistic: { sprint: { right: 0, wrong: 0 }, audioCall: { right: 0, wrong: 0 } },
        },
      });
      this.updateUserWord(cardId, { difficulty: 'easy', optional: { isDifficult: false, isLearnt: true } });
      popupsContainer.node.innerHTML = 'Добавлено в изученные слова';
      this.hideAlert(popupsContainer);
      this.callBack('learnt', '+');
      this.node.querySelector('.difficult-word-button').classList.add('disable-word-buttons');
    } else if (this.isLearnt) {
      this.node.classList.remove(this.learntWordClassName);
      this.isLearnt = false;
      this.node.querySelector('.difficult-word-button').classList.remove('disable-word-buttons');
      popupsContainer.node.innerHTML = 'Удалено из изученных слов';
      this.hideAlert(popupsContainer);
      this.callBack('learnt', '-');
      if (this.isDifficult) {
        this.updateUserWord(cardId, { difficulty: 'hard', optional: { isDifficult: true, isLearnt: false } });
      } else {
        this.updateUserWord(cardId, { difficulty: 'easy', optional: { isDifficult: false, isLearnt: false } });
      }
    }
  }

  private renderToggleButtons() {
    if (app.currentUser.isAuthenticated) {
      this.controlButtonsWrapper.node.style.display = 'flex';
      if (this.isLearnt) {
        this.node.querySelector('.difficult-word-button').classList.add('disable-word-buttons');
        this.node.querySelector('.delete-word-button').classList.remove('disable-word-buttons');
      } else if (this.isDifficult) {
        this.node.querySelector('.difficult-word-button').classList.remove('disable-word-buttons');
        this.node.querySelector('.delete-word-button').classList.add('disable-word-buttons');
      } else {
        this.node.querySelector('.delete-word-button').classList.remove('disable-word-buttons');
        this.node.querySelector('.difficult-word-button').classList.remove('disable-word-buttons');
      }
    }
  }

  private listenEvents(): void {
    this.playButton.node.addEventListener('click', this.playAudio.bind(this));
    this.difficultWordButton.node.addEventListener('click', this.toggleToDifficult.bind(this));
    this.learntWordButton.node.addEventListener('click', this.toggleToLearnt.bind(this));
    if (getAuthorizedUser()) {
      this.gameStatsButton.node.addEventListener('click', this.openModalStats.bind(this));
      document.querySelector('.closeBtn').addEventListener('click', this.closeModalStats.bind(this));
      window.addEventListener('click', this.closeModalStatsOutsideClick);
    }
  }
}
