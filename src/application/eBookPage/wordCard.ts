import Control from '../../controls/control';
import '../../css/word.css';
import { IWordCard } from './IWordCard';
import WordsController from '../services/words/getWords';

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

  constructor(parentNode: HTMLElement, wordCardInfo: IWordCard) {
    super(parentNode, 'div', 'word-card-wrapper', '');
    this.container = new Control(this.node, 'div');
    this.isDifficult = !!wordCardInfo.userWord?.optional?.isDifficult;
    this.isLearnt = false;
    this.wordCardInfo = wordCardInfo;
  }

  render(): void {
    this.node.id = this.getId();
    this.renderCardNameWrapper();
    this.renderCardImage();
    this.renderCardInfoWrapper();
    this.renderCardMeaningWrapper();
    this.renderCardExampleWrapper();
    this.renderControlButtons();
    this.listenEvents();
  }

  private getId() {
    return this.wordCardInfo.id || this.wordCardInfo._id;
  }

  private renderCardNameWrapper(): void {
    const cardNameWrapper = new Control(this.container.node, 'div', 'card-name-wrapper');
    const cardTitle = new Control(cardNameWrapper.node, 'div', 'card-title-wrapper');
    this.playButton = new Control(cardTitle.node, 'button', 'play-button');
    new Control(cardTitle.node, 'span', 'word-name', this.wordCardInfo.word);
    const cardName = new Control(cardNameWrapper.node, 'div', 'card-name');
    new Control(cardName.node, 'span', 'word-transcription', `${this.wordCardInfo.transcription}`);
    new Control(cardName.node, 'span', 'word-translation', `${this.wordCardInfo.wordTranslate}`);
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
    const controlButtonsWrapper = new Control(this.node, 'div', 'control-buttons-wrapper');
    this.difficultWordButton = new Control(controlButtonsWrapper.node, 'button', 'difficult-word-button', 'Сложное');
    this.learntWordButton = new Control(controlButtonsWrapper.node, 'button', 'delete-word-button', 'Изученное');
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
    await this.service.getUserWords();
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
    const cardId = this.getId();
    this.agregUserWord(cardId);
    if (!this.isDifficult) {
      this.isDifficult = true;
      this.node.querySelector('.difficult-word-button').innerHTML = 'Легкое';
      this.node.classList.add(this.difficultWordClassName);
      this.createUserWord(cardId, { difficulty: 'hard', optional: { isDifficult: true, isLearnt: false } });
    } else if (this.isDifficult) {
      this.node.classList.remove(this.difficultWordClassName);
      this.node.querySelector('.difficult-word-button').innerHTML = 'Сложное';
      this.isDifficult = false;
      this.updateUserWord(cardId, { difficulty: 'easy', optional: { isDifficult: false, isLearnt: false } });
    }
    this.getUserWords();
  }

  private toggleToLearnt(): void {
    const cardId = this.getId();
    this.agregUserWord(cardId);
    if (!this.isLearnt) {
      this.isLearnt = true;
      this.node.classList.add(this.learntWordClassName);
      this.createUserWord(cardId, { difficulty: 'easy', optional: { isDifficult: false, isLearnt: true } });
      this.updateUserWord(cardId, { difficulty: 'easy', optional: { isDifficult: false, isLearnt: true } });
    } else if (this.isLearnt) {
      this.node.classList.remove(this.learntWordClassName);
      this.isLearnt = false;
      if (this.isDifficult) {
        this.updateUserWord(cardId, { difficulty: 'hard', optional: { isDifficult: true, isLearnt: false } });
      } else {
        this.updateUserWord(cardId, { difficulty: 'easy', optional: { isDifficult: false, isLearnt: false } });
      }
    }
  }

  private listenEvents(): void {
    this.playButton.node.addEventListener('click', this.playAudio.bind(this));
    this.difficultWordButton.node.addEventListener('click', this.toggleToDifficult.bind(this));
    this.learntWordButton.node.addEventListener('click', this.toggleToLearnt.bind(this));
  }
}
