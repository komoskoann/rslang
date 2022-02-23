import Control from '../../../controls/control';
import sprintGameCard from './sprintGameCard.html';
import { ISprint } from './ISprint';
import GetWordsToSprint from '../../services/sprintGame/getWordsToSprint';
import MainSprintSection from './sprintMainSection';
import LocalStorage from '../../services/words/localStorage';
import Footer from '../../mainPage/footer';

export default class SprintGameCard extends Control {
  private wordCardInfo: ISprint;

  private audio: HTMLAudioElement;

  private serverURL: string = 'https://rslangapplication.herokuapp.com/';

  mainSprint: MainSprintSection;

  service: GetWordsToSprint = new GetWordsToSprint();

  currentEnglishLevel: number;

  englishLevelBook: number;

  englishPageBook: number;

  private isPlaying: boolean = false;

  gameFrom: string;

  private playNum: number = 0;

  localStorage: LocalStorage = new LocalStorage();

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

  private isHard: boolean;

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
    document.querySelector('.footer')?.remove();
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
    return Math.floor(Math.random() * 30);
  }

  async getWords(page: number, group: number): Promise<void> {
    let wordsOnPage: ISprint[] = await this.service.getWordstoSprint(page, group);
    console.log(wordsOnPage)
    let shuffled = wordsOnPage.map((value) => ({value})).sort(() => Math.random() - 0.5).map(({value}) => value);
    this.node.querySelector('.word-translation').innerHTML = shuffled[0].wordTranslate;
    this.node.querySelector('.word-name').innerHTML = wordsOnPage[0].word;
    let j = 1;
    this.node.querySelectorAll('[word]').forEach((word) => {
      function createResult(instance: SprintGameCard, e: KeyboardEventInit) {
        if (j < wordsOnPage.length) {
          instance.node.querySelector('.word-translation').innerHTML = shuffled[j].wordTranslate;
          instance.node.querySelector('.word-name').innerHTML = wordsOnPage[j].word;
          if (word.classList.contains('true-button') || e.key === 'ArrowRight'){
            if (wordsOnPage[j].wordTranslate === shuffled[j].wordTranslate) {
              instance.trueWord.push(wordsOnPage[j]);
              instance.colorIndicator(true);
              instance.seriesAns +=1; 
              (instance.seriesAns >= 4) ? instance.result += 20 : instance.result += 10; 
            }
            instance.result -= 10; instance.seriesAns = 0;
            instance.colorIndicator(false);
            instance.falseWord.push(wordsOnPage[j]);
          }
          if (word.classList.contains('false-button') || e.key === 'ArrowLeft'){
            if(wordsOnPage[j].wordTranslate === shuffled[j].wordTranslate) {
              instance.falseWord.push(wordsOnPage[j]);
              instance.colorIndicator(false);
              instance.result -= 10; instance.seriesAns = 0;
            } 
            instance.colorIndicator(true);
            instance.trueWord.push(wordsOnPage[j]); 
            (instance.seriesAns >= 4) ? instance.result += 20 : instance.result += 10; 
            instance.seriesAns +=1;
          }
          if (j === wordsOnPage.length-1){
          instance.stop = true;
        }
        let coefficient = (instance.seriesAns >=4) ? 20 : 10;
        instance.node.querySelector('.coefficient').innerHTML = `${coefficient}`;
        instance.seriesArr.push(instance.seriesAns);
        } j += 1;
        instance.getResultTable();
      }
      word.addEventListener('keydown', createResult.bind(null, this)) ;
      word.addEventListener('click', createResult.bind(null, this));})
  }



 /*
  async getWords(page: number, group: number): Promise<void> {
    let wordsOnPage: ISprint[] = await this.service.getWordstoSprint(page, group);
    let shuffled = wordsOnPage
      .map((value) => ({ value }))
      .sort(() => Math.random() - 0.5)
      .map(({ value }) => value);
    let correctArr = shuffled.slice(0, 8);
    this.node.querySelector('.word-translation').innerHTML = correctArr.includes(wordsOnPage[0])
      ? wordsOnPage[0].wordTranslate
      : shuffled[0].wordTranslate;
    this.node.querySelector('.word-name').innerHTML = wordsOnPage[0].word;
    let j = 1;
    this.node.querySelectorAll('[word]').forEach((word) => {
      function createResult(instance: SprintGameCard, e: KeyboardEventInit) {
        if (j < wordsOnPage.length) {
          instance.node.querySelector('.word-translation').innerHTML = correctArr.includes(wordsOnPage[j])
            ? wordsOnPage[j].wordTranslate
            : shuffled[j].wordTranslate;
          instance.node.querySelector('.word-name').innerHTML = wordsOnPage[j].word;
          if (word.classList.contains('true-button') || e.key === 'ArrowRight') {
            if (correctArr.includes(wordsOnPage[j])) {
              instance.trueWord.push(wordsOnPage[j]);
              instance.colorIndicator(true);
              instance.seriesAns += 1;
              if (instance.seriesAns >= 4) {
                instance.result += 20;
              } else instance.result += 10;
            }
            else {
              instance.result -= 10;
            instance.seriesAns = 0;
            instance.colorIndicator(false);
            instance.falseWord.push(wordsOnPage[j]);
            }
          }
          if (word.classList.contains('false-button') || e.key === 'ArrowLeft') {
            if (correctArr.includes(wordsOnPage[j])) {
              instance.falseWord.push(wordsOnPage[j]);
              instance.colorIndicator(false);
              instance.result -= 10;
              instance.seriesAns = 0;
            }
            else {
            instance.colorIndicator(true);
            instance.trueWord.push(wordsOnPage[j]);

            if (instance.seriesAns >= 4) {
              instance.result += 20;
            } else instance.result += 10;
            instance.seriesAns += 1;
          }
          }
          if (j === wordsOnPage.length - 1) {
            instance.stop = true;
          }
          let coefficient = instance.seriesAns >= 4 ? 20 : 10;
          instance.node.querySelector('.coefficient').innerHTML = `${coefficient}`;
          instance.seriesArr.push(instance.seriesAns);
        }
        j += 1;
        instance.getResultTable();
      }
      word.addEventListener('keydown', createResult.bind(null, this));
      word.addEventListener('click', createResult.bind(null, this));
    });
  }
*/
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
    new Footer(document.body);
  }
}
