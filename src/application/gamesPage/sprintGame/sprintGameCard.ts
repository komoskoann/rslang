import Control from '../../../controls/control';
import sprintGameCard from './sprintGameCard.html';
import { ISprint } from './ISprint';
import GetWordsToSprint from '../../services/sprintGame/getWordsToSprint';
import MainSprintSection from './sprintMainSection';
import LocalStorage from '../../services/words/localStorage';
import GameWordsController from '../../services/gameWords/gameWordsController';

export default class SprintGameCard extends Control {
  private wordCardInfo: ISprint;

  private audio: HTMLAudioElement;

  private serverURL: string = 'https://rslangapplication.herokuapp.com/';

  private rightWord: ISprint;

  private wordsOnPage: ISprint[];

  private round: number = 0;

  private roundResult: string;

  mainSprint: MainSprintSection;

  service: GetWordsToSprint = new GetWordsToSprint();

  currentEnglishLevel: number;

  englishLevelBook: number;

  englishPageBook: number;

  private isPlaying: boolean = false;

  gameFrom: string;

  private playNum: number = 0;

  localStorage: LocalStorage = new LocalStorage();

  GameWordsController: GameWordsController = new GameWordsController();

  private currentPage: number;

  private stop: boolean;

  private seriesAns: number = 0;

  private trueWord: ISprint[] = [];

  private seriesArr: Array<number> = [];

  private falseWord: ISprint[] = [];

  private result: number = 0;

  private maxSeries: number = 0;

  private correctAnswers: number;

  private wrongAnswers: number;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'sprint-card-section');
    const cardSprint = new Control(this.node, 'div', 'card-sprint container-xxl');
    cardSprint.node.innerHTML = sprintGameCard;
    this.currentPage = this.randomPage();
    this.startTime();
    this.englishPageBook = +this.localStorage.getFromLocalStorage('currentWordPage');
    this.englishLevelBook = +this.localStorage.getFromLocalStorage('currentEngLevel');
    this.currentEnglishLevel = +this.localStorage.getFromLocalStorage('EngLevel');
    this.maxSeries = Math.max.apply(null, this.seriesArr);
    this.getFrom();
  }

  private getFrom() {
    this.gameFrom = this.localStorage.getFromLocalStorage('from');
    if (this.gameFrom === 'game') {
      this.getWords(this.currentPage, this.currentEnglishLevel);
    } else if (this.gameFrom === 'ebook') {
      this.getWords(this.englishPageBook, this.englishLevelBook);
    }
  }

  private randomPage() {
    return Math.round(Math.random() * 29);
  }

  private getWords = async (page: number, group: number): Promise<void> => {
    this.wordsOnPage = await this.service.getWordstoSprint(page, group);
  };

  private nextRound = (): void => {
    this.getResultTable();
    if (this.round < this.wordsOnPage.length) {
      this.rightWord = this.wordsOnPage[this.round];
      this.node.querySelector('.word-translation').innerHTML =
        Math.random() > 0.5
          ? this.wordsOnPage[Math.round(Math.random() * 19)].wordTranslate
          : this.wordsOnPage[this.round].wordTranslate;
      this.node.querySelector('.word-name').innerHTML = this.wordsOnPage[this.round].word;
    } else {
      window.removeEventListener('click', this.checkMouseWordButtons);
      window.removeEventListener('keydown', this.checkKeyboardWordButtons);
      this.stop = true;
    }
  };

  private addEventLisneters = (): void => {
    window.addEventListener('click', this.checkMouseWordButtons);
    window.addEventListener('keydown', this.checkKeyboardWordButtons);
  };

  private checkMouseWordButtons = (e: MouseEvent): void => {
    const target = (e.target as Element).closest('[word]') as HTMLButtonElement;
    if (!target) {
      return;
    }
    if (target.classList.contains('true-button')) {
      this.giveTrueAnswer();
    } else if (target.classList.contains('false-button')) {
      this.giveFalseAnswer();
    }
  };

  private checkKeyboardWordButtons = (e: KeyboardEvent): void => {
    if (e.code === 'ArrowRight') {
      this.giveTrueAnswer();
    } else if (e.code === 'ArrowLeft') {
      this.giveFalseAnswer();
    }
  };

  private giveTrueAnswer = (): void => {
    if (this.node.querySelector('.word-translation').innerHTML === this.wordsOnPage[this.round].wordTranslate) {
      this.roundResult = 'right';
      this.trueWord.push(this.wordsOnPage[this.round]);
      this.colorIndicator(true);
      setTimeout(() => {
        (this.node.querySelector('.card-translate') as HTMLElement).style.background = 'rgba(255, 255, 255, 0.315)';
      }, 300);
      this.seriesAns += 1;
      if (this.seriesAns >= 4) {
        this.result += 20;
      } else {
        this.result += 10;
      }
    } else {
      this.roundResult = 'wrong';
      this.result -= 10;
      this.seriesAns = 0;
      this.colorIndicator(false);
      setTimeout(() => {
        (this.node.querySelector('.card-translate') as HTMLElement).style.background = 'rgba(255, 255, 255, 0.315)';
      }, 300);
      this.falseWord.push(this.wordsOnPage[this.round]);
    }
    this.checkRound();
    this.checkResult();
  };

  private giveFalseAnswer = (): void => {
    if (this.node.querySelector('.word-translation').innerHTML === this.wordsOnPage[this.round].wordTranslate) {
      this.roundResult = 'wrong';
      this.falseWord.push(this.wordsOnPage[this.round]);
      this.colorIndicator(false);
      setTimeout(() => {
        (this.node.querySelector('.card-translate') as HTMLElement).style.background = 'rgba(255, 255, 255, 0.315)';
      }, 300);
      this.result -= 10;
      this.seriesAns = 0;
    } else {
      this.roundResult = 'right';
      this.colorIndicator(true);
      setTimeout(() => {
        (this.node.querySelector('.card-translate') as HTMLElement).style.background = 'rgba(255, 255, 255, 0.315)';
      }, 300);
      this.trueWord.push(this.wordsOnPage[this.round]);
      if (this.seriesAns >= 4) {
        this.result += 20;
      } else {
        this.result += 10;
      }
      this.seriesAns += 1;
    }
    this.checkResult();
    this.checkRound();
  };

  private checkRound = (): void => {
    ++this.round;
    let coefficient = this.seriesAns >= 4 ? 20 : 10;
    this.node.querySelector('.coefficient').innerHTML = `${coefficient}`;
    this.seriesArr.push(this.seriesAns);
    this.nextRound();
  };

  private checkResult = async (): Promise<void> => {
    const word = (await this.GameWordsController.getUserAgrWord(this.rightWord.id))[0];
    if (!word.userWord) {
      if (this.roundResult === 'right') {
        await this.GameWordsController.createUserWord(word.id, {
          difficulty: 'studied',
          optional: { isDifficult: false, isLearnt: false, seriaLength: 1, result: this.roundResult },
        });
      } else {
        await this.GameWordsController.createUserWord(word.id, {
          difficulty: 'studied',
          optional: { isDifficult: false, isLearnt: false, seriaLength: 1, result: this.roundResult },
        });
      }
    } else {
      if (word.userWord.optional.seriaLength) {
        let seriaLength = word.userWord.optional.seriaLength;
        let result = word.userWord.optional.result;
        if (this.roundResult === 'right') {
          if (result === this.roundResult) {
            word.userWord.optional.seriaLength = ++seriaLength;
            if (
              (word.userWord.difficulty === 'studied' && seriaLength >= 3) ||
              (word.userWord.difficulty === 'hard' && seriaLength >= 5)
            ) {
              word.userWord.difficulty = 'easy';
              word.userWord.optional.isLearnt = true;
              word.userWord.optional.isDifficult = false;
            }
          } else {
            word.userWord.optional.seriaLength = 1;
            word.userWord.optional.result = this.roundResult;
          }
        } else {
          if (result === this.roundResult) {
            word.userWord.optional.seriaLength = ++seriaLength;
          } else {
            word.userWord.optional.seriaLength = 1;
            word.userWord.optional.result = this.roundResult;
          }
        }
      } else {
        word.userWord.optional.seriaLength = 1;
        word.userWord.optional.result = this.roundResult;
        word.userWord.optional.isLearnt = false;
        word.userWord.optional.isDifficult = false;
      }
      await this.GameWordsController.changeUserWord(word.id, word.userWord);
    }
  };

  private getResultTable() {
    this.node.querySelector('.result').innerHTML = `${this.result}`;
    this.node.querySelector('.point-result').innerHTML = `${this.result}`;
    this.node.querySelector('.right-count').innerHTML = `${this.trueWord.length}`;
    this.node.querySelector('.right-cont').innerHTML = '';

    for (let i = 0; i < this.trueWord.length; i++) {
      const rightWordCont = new Control(this.node.querySelector('.right-cont'), 'div', 'word-cont');
      const playButton = new Control(rightWordCont.node, 'button', 'play-button');
      playButton.node.addEventListener('click', () => this.playAudio(this.trueWord, i));
      new Control(rightWordCont.node, 'div', 'word', `${this.trueWord[i].word} - `);
      new Control(rightWordCont.node, 'div', 'translate', `${this.trueWord[i].wordTranslate}`);
    }
    this.node.querySelector('.wrong-count').innerHTML = `${this.falseWord.length}`;
    this.node.querySelector('.wrong-cont').innerHTML = '';
    for (let i = 0; i < this.falseWord.length; i++) {
      const wrongWordCont = new Control(this.node.querySelector('.wrong-cont'), 'div', 'word-cont');
      const playButton = new Control(wrongWordCont.node, 'button', 'play-button');
      playButton.node.addEventListener('click', () => this.playAudio(this.falseWord, i));
      new Control(wrongWordCont.node, 'div', 'word', `${this.falseWord[i].word} - `);
      new Control(wrongWordCont.node, 'div', 'translate', ` ${this.falseWord[i].wordTranslate}`);
    }
  }

  private playAudio(arr: Array<ISprint>, i: number): void {
    if (!this.isPlaying || this.audio?.ended) {
      this.audio = new Audio();
      this.audio.src = `${this.serverURL}${arr[i].audio}`;
      this.audio.play();
      this.isPlaying = true;
      this.audio.addEventListener('ended', () => this.getSongNext);
    } else if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  private getSongNext(arr: Array<ISprint>, i: number): void {
    this.isPlaying = !this.isPlaying;
    if (this.playNum != 0) {
      this.playNum++;
      this.playAudio(arr, i);
    } else {
      this.playNum = 0;
    }
  }

  private timer(): void {
    let counter = this.node.querySelector('.seconds');
    let interval: NodeJS.Timer,
      isStart = false;
    let count = 30;
    if (!isStart) {
      isStart = true;
      interval = setInterval(() => {
        if (!count || this.stop) {
          clearInterval(interval);
          this.getResult();
        }
        if (count < 10) counter.textContent = '0' + count--;
        else counter.textContent = '' + count--;
      }, 1000);
    }
  }

  private colorIndicator(word: boolean): void {
    (this.node.querySelector('.card-translate') as HTMLElement).style.background = word
      ? 'var(--right-ans)'
      : 'var(--wrong-ans)';
  }

  private startTime() {
    (this.node.querySelector('.card-translate') as HTMLElement).style.display = 'none';
    (this.node.querySelector('.false-button') as HTMLButtonElement).disabled = true;
    (this.node.querySelector('.true-button') as HTMLButtonElement).disabled = true;
    let timeToStart = this.node.querySelector('.time-to-start');
    let interval: NodeJS.Timer,
      isStart = false;
    let count = 5;
    if (!isStart) {
      isStart = true;
      interval = setInterval(() => {
        if (count == 0) {
          this.addEventLisneters();
          this.nextRound();
          clearInterval(interval);
        }
        timeToStart.textContent = '' + count--;
      }, 1000);
    }
    setTimeout(() => {
      (this.node.querySelector('.false-button') as HTMLButtonElement).disabled = false;
      (this.node.querySelector('.true-button') as HTMLButtonElement).disabled = false;
      (this.node.querySelector('.card-start-time') as HTMLElement).style.display = 'none';
      (this.node.querySelector('.card-translate') as HTMLElement).style.display = 'flex';
      this.timer();
    }, 6000);
  }

  private getResult(): void {
    (this.node.querySelector('.card-result-wrapper') as HTMLElement).style.display = 'flex';
  }

  destroy() {
    super.destroy();
  }
}
