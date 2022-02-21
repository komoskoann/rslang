import audioChallengeGamePageHTML from './audioChallengeGamePage.html';
import Control from '../../../controls/control';
import '../../../css/audioChallege.css';
import { IWordCard } from '../../eBookPage/ebookInterface';
import { IPlayList } from '../../eBookPage/wordCard';
import { Resolver } from 'webpack';

export default class audioChallengeGamePage extends Control {
  private audio: HTMLAudioElement;
  private isPlaying = false;
  private words: IWordCard[];
  private card: HTMLElement;
  private musicModeButton: HTMLElement;
  private soundRepeatButton: HTMLElement;
  /* private wordButtons: NodeListOf<Element>; */
  private dotIndicators: NodeListOf<Element>;
  private skipButton: HTMLElement;
  private isSoundsOn: boolean = true;
  private isAnswerChecked: boolean = false;
  private round: number = 0;
  private totalRounds = 10;
  private playList: IPlayList[];
  private serverURL = 'https://rslangapplication.herokuapp.com/';
  constructor(parentNode: HTMLElement, words: IWordCard[]) {
    super(parentNode.parentElement, 'div', 'audio-challenge-container', '');
    this.node.innerHTML = audioChallengeGamePageHTML;
    this.words = this.shuffle(words);
    this.musicModeButton = this.node.querySelector('.audio-challenge__music-button');
    this.soundRepeatButton = document.querySelector('.audio-challenge__sound-button');
    this.card = document.querySelector('.audio-challenge__card');
    /* this.wordButtons = document.querySelectorAll('.audio-challenge__word-button'); */
    this.skipButton = this.node.querySelector('.audio-challenge__skip-button');
    this.addEventListeners();
    this.nextRound();
    this.createDots();
  }
  private shuffle = (array: IWordCard[]): IWordCard[] => {
    const arraycopy = [...array];
    for (let i = arraycopy.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arraycopy[i], arraycopy[j]] = [arraycopy[j], arraycopy[i]];
    }
    return arraycopy;
  }
  private createDots = (): void => {
    const container = document.querySelector('.audio-challenge__dots-items');
    let count = 0;
    while (count < this.totalRounds) {
      const dot = document.createElement('div');
      dot.classList.add('audio-challenge__dots-item');
      container.append(dot);
      ++count;
    }
    this.dotIndicators = document.querySelectorAll('.audio-challenge__dots-item');
  }
  private addEventListeners = (): void => {
    this.musicModeButton.addEventListener('click', this.toggleSoundMode);
    this.soundRepeatButton.addEventListener('click', () => this.playAudio(0));
  }
  private toggleSoundMode = (): void => {
    this.musicModeButton.classList.toggle('music-cancel');
    this.isSoundsOn = this.musicModeButton.classList.contains('music-cancel') ? false : true;
  }
  private playAudio = (x: number): void => {
    this.createPlaylist();
    if (!this.isPlaying || this.audio?.ended) {
      this.audio = new Audio();
      this.audio.volume = 0.05;
      this.audio.src = this.playList[x].src;
      this.audio.play();
      this.isPlaying = true;
    } else if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }
  private nextRound = (): void => {
    this.isAnswerChecked = false;
    if (this.round >= this.totalRounds) {
      console.log('end');
      this.summurize();
      return;
    }
    this.skipButton.textContent = 'Не знаю';
    this.playAudio(0);
    const wordButtons = document.querySelectorAll('.audio-challenge__word-button');
    const rightWord = this.words[this.round];
    const variants: IWordCard[] = this.shuffle(Array.from(new Set([rightWord, ...this.shuffle(this.words)])).slice(0, 5));    
    wordButtons.forEach((button, index) => {
      button.className = 'audio-challenge__word-button';
      button.textContent = `${index + 1}. ${variants[index].wordTranslate.slice(0, 1).toUpperCase() + variants[index].wordTranslate.slice(1)}`;
      if (button.textContent.toLowerCase().slice(3) === rightWord.wordTranslate) {
        button.classList.add('correct');
      } else {
        button.classList.add('not-correct');
      }
    });
    setTimeout(() => window.addEventListener('click', this.checkAnswer), 0);
    setTimeout(() => window.addEventListener('click', this.skipWord), 0);
  }
  private fillCard = async (): Promise<void> => {
    const img = this.card.querySelector('.audio-challenge__card-image') as HTMLImageElement;
    img.src = img.src = `${this.serverURL}${this.words[this.round].image}`;
    this.node.querySelector('.audio-challenge__word-title').textContent = `${this.words[this.round].word}`;
    this.node.querySelector('.audio-challenge__word-transcription').textContent = `${this.words[this.round].transcription}`;
    this.node.querySelector('.audio-challenge__word-example_title').innerHTML = `${this.words[this.round].textExample}`;
    this.node.querySelector('.audio-challenge__word-example_translation').textContent = `${this.words[this.round].textExampleTranslate}`;
    document.getElementById('audio-challenge__word').onclick = () => this.playAudio(0);
    document.getElementById('audio-challenge__example').onclick = () => this.playAudio(2);
    img.onload = () => {
      this.card.style.visibility = 'visible';
      this.card.style.opacity = '1';
    }
  }
  private summurize = (): void => {
    this.node.innerHTML = 'ТАБЛИЦА ИТОГОВ';
  }
  private checkAnswer = (): void => {
    const variantButton = (event.target as Element).closest('.audio-challenge__word-button') as HTMLButtonElement;
    if (variantButton && !this.isAnswerChecked) {
      variantButton.classList.add('active');
      if (!variantButton.classList.contains('correct')) {
        this.node.querySelector('.correct').classList.add('active');
        (this.dotIndicators[this.round] as HTMLElement).style.backgroundColor = 'red';
      } else {
        (this.dotIndicators[this.round] as HTMLElement).style.backgroundColor = 'green';
      }
      this.renderWordCard();
    }
  }
  private skipWord = (): void => {
    if (event.target === this.skipButton) {
      this.node.querySelector('.correct').classList.add('active');
      (this.dotIndicators[this.round] as HTMLElement).style.backgroundColor = 'royalblue';
      this.renderWordCard();
    }
  }
  private renderWordCard = (): void => {
    this.node.removeEventListener('click', this.checkAnswer);
    this.skipButton.innerHTML = '';
    this.skipButton.classList.add('audio-challenge__skip-button_background');
    this.skipButton.classList.add('audio-challenge__skip-button_next-round');
    this.skipButton.addEventListener('click', this.hideWordCard);
    this.soundRepeatButton.style.visibility = 'hidden';
    this.soundRepeatButton.style.opacity = '0';
    this.fillCard();
    this.isAnswerChecked = true;
  }
  private hideWordCard = (): void => {
    this.skipButton.className = 'audio-challenge__skip-button';
    ++this.round;
    this.skipButton.removeEventListener('click', this.nextRound);
    this.soundRepeatButton.style.visibility = 'visible';
    this.soundRepeatButton.style.opacity = '1';
    this.card.style.visibility = 'hidden';
    this.card.style.opacity = '0';
    this.audio.pause();
    this.isPlaying = false;
    this.nextRound();
    this.skipButton.removeEventListener('click', this.hideWordCard);
    window.removeEventListener('click', this.checkAnswer);
    window.removeEventListener('click', this.skipWord);
  }
  private createPlaylist = (): IPlayList[] => {
    return this.playList = [
      {
        title: 'example',
        src: `${this.serverURL}${this.words[this.round].audio}`,
      },
      {
        title: 'audioMeaning',
        src: `${this.serverURL}${this.words[this.round].audioMeaning}`,
      },
      {
        title: 'audioExample',
        src: `${this.serverURL}${this.words[this.round].audioExample}`,
      },
      {
        title: 'answer',
        src: `../../../assets/audio-challenge/answer.mp3`,
      },
      {
        title: 'table',
        src: `../../../assets/audio-challenge/table.mp3`,
      },
    ];
  }
}