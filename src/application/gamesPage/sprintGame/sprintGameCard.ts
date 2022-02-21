import Control from '../../../controls/control';
import sprintGameCard from './sprintGameCard.html';
import { ISprint } from './ISprint';
import GetWordsToSprint from '../../services/sprintGame/getWordsToSprint';
import MainSprintSection from './sprintMainSection';
import LocalStorage from '../../services/words/localStorage';

export default class SprintGameCard extends Control {
  mainSprint : MainSprintSection;

  service: GetWordsToSprint = new GetWordsToSprint();

  currentEnglishLevel: number;

  localStorage: LocalStorage = new LocalStorage();

  private  currentPage : number;

  private stop: boolean;

  private seriesAns : number;

  private trueWord : ISprint[] = [];

  private seriesArr : Array<number> = [];

  private falseWord : ISprint[] = [];

  private result : number = 0;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'sprint-card-section');
    const cardSprint = new Control(this.node, 'div', 'card-sprint container-xxl');
    cardSprint.node.innerHTML = sprintGameCard;
    this.currentPage = this.randomPage();
    console.log(this.currentPage)
    this.startTime();
    this.currentEnglishLevel =
      +this.localStorage.getFromLocalStorage('EngLevel');
    this.getWords(this.currentEnglishLevel);
  }

  private randomPage() {
    return Math.floor(Math.random()*31);
  }

  async getWords(group: number): Promise<void> {
    let wordsOnPage: ISprint[] = await this.service.getWordstoSprint(this.currentPage, group);
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
        instance.seriesArr.push(instance.seriesAns);
        //console.log(Math.max.apply(null, instance.seriesArr));
        console.log(instance.seriesAns)
        } j += 1;
        instance.getResultTable();
      }
      word.addEventListener('keydown', createResult.bind(null, this)) ;
      word.addEventListener('click', createResult.bind(null, this));})
  }

  private getResultTable() {
    this.node.querySelector('.result').innerHTML = `${this.result}`;
    this.node.querySelector('.point-result').innerHTML = `${this.result}`;
    this.node.querySelector('.right-count').innerHTML = `${this.trueWord.length}`;
    this.node.querySelector('.right-cont').innerHTML ='';  
  for (let i = 0; i<this.trueWord.length; i++) {
          const rightWordCont = new Control(this.node.querySelector('.right-cont'), 'div', 'word-cont');      
          new Control(rightWordCont.node, 'div', 'word', `${this.trueWord[i].word} - `);
          new Control(rightWordCont.node, 'div', 'translate', `${this.trueWord[i].wordTranslate}`);
        }
        this.node.querySelector('.wrong-count').innerHTML = `${this.falseWord.length}`;
        this.node.querySelector('.wrong-cont').innerHTML ='';  
        for (let i = 0; i < this.falseWord.length; i++) {
          const wrongWordCont = new Control(this.node.querySelector('.wrong-cont'), 'div', 'word-cont');      
          new Control(wrongWordCont.node, 'div', 'word', `${this.falseWord[i].word} - `);
          new Control(wrongWordCont.node, 'div', 'translate', ` ${this.falseWord[i].wordTranslate}`);
        }
  }

  private timer(): void {
    let counter = this.node.querySelector('.seconds');
    let interval: NodeJS.Timer, isStart = false;
    let count = 30;
    if (!isStart) {
      isStart = true;
      interval = setInterval( () => {
        if (count == 0 || (this.stop === true)) {
          clearInterval(interval);
          this.getResult();
        }
        if (count < 10) counter.textContent = '0' + count--;
        else counter.textContent = '' + count--;
      }, 1000);
    }
  }
   
  private colorIndicator(word : boolean) : void {
    switch(word){
      case(false):
      (this.node.querySelector('.card-translate') as HTMLElement).style.background = 'var(--wrong-ans)';
      break;
      case(true):
      (this.node.querySelector('.card-translate') as HTMLElement).style.background = 'var(--right-ans)';
      break;
    }
  }
 
  private startTime() {
    (this.node.querySelector('.card-translate') as HTMLElement).style.display = 'none';
    let timeToStart = this.node.querySelector('.time-to-start');
    let interval: NodeJS.Timer, isStart = false; let count = 5;
    if (!isStart) {
      isStart = true;
      interval = setInterval( () => {
        if (count == 0) {
          clearInterval(interval);
        }
        timeToStart.textContent = '' + count--;
      }, 1000);
    }
    setTimeout(() => {
      (this.node.querySelector('.card-start-time') as HTMLElement).style.display = 'none';
      (this.node.querySelector('.card-translate') as HTMLElement).style.display = 'flex';
      this.timer()
    }, 6000)
  }

  private getResult() : void {
    (this.node.querySelector('.card-result-wrapper') as HTMLElement).style.display ='flex';
  }

  destroy() {
    super.destroy();
  }
}
