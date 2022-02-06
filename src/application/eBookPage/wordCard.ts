import Control from '../../controls/control';
import './word.css';
import { IWordCard } from './IWordCard';
import { IPlayList } from './IPlayList';

export default class WordCard extends Control {
  cardInfoWrapper: Control<HTMLElement>;
  audio: HTMLAudioElement;
  isDifficult: boolean;
  playButton: Control<HTMLElement>;
  difficultWordButton: Control<HTMLElement>;
  learntWordButton: Control<HTMLElement>;
  isLearnt: boolean;
  wordCardInfo: IWordCard;
  playList: IPlayList[];
  playNum: number = 0;
  container: Control<HTMLElement>;

  private serverURL: string = 'https://rslangapplication.herokuapp.com/';
  isPlaying: boolean = false;

  constructor(parentNode: HTMLElement, wordCardInfo: IWordCard) {
    super(parentNode, 'div', 'word-card-wrapper', '');
    this.container = new Control(this.node, 'div');
    this.isDifficult = false;
    this.isLearnt = false;
    this.wordCardInfo = wordCardInfo;
  }

  private renderCardNameWrapper() {
    const cardNameWrapper = new Control(this.container.node, 'div', 'card-name-wrapper');
    const cardTitle = new Control(cardNameWrapper.node, 'div', 'card-title-wrapper');
    this.playButton = new Control(cardTitle.node, 'button', 'play-button');
    const wordName = new Control(cardTitle.node, 'span', 'word-name', this.wordCardInfo.word);
    const cardName = new Control(cardNameWrapper.node, 'div', 'card-name');
    const wordInfo = new Control(cardName.node, 'span', 'word-info', `${this.wordCardInfo.transcription} ${this.wordCardInfo.wordTranslate}`);
  }

  private renderCardImage() {
    const cardImageWrapper = new Control(this.container.node, 'div', 'card-image-wrapper');
    cardImageWrapper.node.innerHTML = `<img src="${this.serverURL}${this.wordCardInfo.image}" alt="word image" class="card-image">`;
  }

  private renderCardInfoWrapper() {
    this.cardInfoWrapper = new Control(this.container.node, 'div', 'card-info-wrapper');
  }

  private renderCardMeaningWrapper() {
    const cardMeaningWrapper = new Control(this.cardInfoWrapper.node, 'div', 'card-meaning-wrapper');
    const wordMeaningEng = new Control(cardMeaningWrapper.node, 'span', 'word-meaning-eng');
    wordMeaningEng.node.innerHTML = this.wordCardInfo.textMeaning;
    const wordMeaningRus = new Control(cardMeaningWrapper.node, 'span', 'word-meaning-rus', this.wordCardInfo.textMeaningTranslate);
  }

  private renderCardExampleWrapper() {
    const cardExampleWrapper = new Control(this.cardInfoWrapper.node, 'div', 'card-example-wrapper');
    const wordExampleEng = new Control(cardExampleWrapper.node, 'span', 'word-example-eng');
    wordExampleEng.node.innerHTML = `→ ${this.wordCardInfo.textExample}`;
    const wordExampleRus = new Control(cardExampleWrapper.node, 'span', 'word-example-rus', this.wordCardInfo.textExampleTranslate);
  }

  private renderControlButtons() {
    const controlButtonsWrapper = new Control(this.node, 'div', 'control-buttons-wrapper');
    this.difficultWordButton = new Control(controlButtonsWrapper.node, 'button', 'difficult-word-button', 'Сложное');
    this.learntWordButton = new Control(controlButtonsWrapper.node, 'button', 'delete-word-button', 'Изученное');
  }

  playAudio() {
    this.createPlaylist();
    if (!this.isPlaying || this.audio?.ended) {
      this.audio = new Audio();
      this.audio.src = this.playList[this.playNum].src;
      this.audio.play();
      this.isPlaying = true;
      this.audio.addEventListener('ended', this.getSongNext.bind(this));
    } else if(this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  createPlaylist() {
    return this.playList = [
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
    ]
  }

  getSongNext() {
    this.isPlaying = !this.isPlaying;
    if(this.playNum != this.playList.length - 1) {
      this.playNum++;
      this.playAudio();
    } else {
      this.playNum = 0;
    }
  }

  toggleToDifficult() {
    if(!this.isDifficult) {
      this.isDifficult = true;
      this.node.classList.add('difficult-word-card');
    } else if(this.isDifficult) {
      this.node.classList.remove('difficult-word-card');
      this.isDifficult = false;
    }
  }

  toggleToLearnt() {
    if(!this.isLearnt) {
      this.isLearnt = true;
      this.node.classList.add('learnt-word-card');
    } else if(this.isLearnt) {
      this.node.classList.remove('learnt-word-card');
      this.isLearnt = false;
    }
  }

  render() {
    this.node.id = this.wordCardInfo.id;
    this.renderCardNameWrapper();
    this.renderCardImage();
    this.renderCardInfoWrapper();
    this.renderCardMeaningWrapper();
    this.renderCardExampleWrapper();
    this.renderControlButtons();
    this.listenEvents();
  }

  listenEvents() {
    this.playButton.node.addEventListener('click', this.playAudio.bind(this));
    this.difficultWordButton.node.addEventListener('click', this.toggleToDifficult.bind(this));
    this.learntWordButton.node.addEventListener('click', this.toggleToLearnt.bind(this));
  }
}
