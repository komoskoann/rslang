import Control from '../../../controls/control';
import sprintGameCard from './sprintGameCard.html';
import { IWordCard } from '../../eBookPage/ebookInterface';
import GetWordsToSprint from '../../services/sprintGame/getWordsToSprint';
import MainSprintSection from './sprintMainSection';
import LocalStorage from '../../services/words/localStorage';

export default class SprintGameCard extends Control {
  mainSprint : MainSprintSection;

  service: GetWordsToSprint = new GetWordsToSprint();

  currentEnglishLevel: number;

  localStorage: LocalStorage = new LocalStorage();

  private  currentPage : number;

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
    let wordsOnPage: IWordCard[] = await this.service.getWordstoSprint(this.currentPage, group);
    let shuffled = wordsOnPage.map((value) => ({value})).sort(() => Math.random() - 0.5).map(({value}) => value);
    this.node.querySelector('.word-translation').innerHTML = shuffled[0].wordTranslate;
    this.node.querySelector('.word-name').innerHTML = wordsOnPage[0].word;
    let j = 1; let trueWord : IWordCard[] = [], falseWord : IWordCard[] = [], result = 0;
    this.node.querySelectorAll('[word]').forEach((word) => {
      function createResult(instance: SprintGameCard, e: KeyboardEventInit) {
        if (j < wordsOnPage.length) {
          
          instance.node.querySelector('.word-translation').innerHTML = shuffled[j].wordTranslate;
          instance.node.querySelector('.word-name').innerHTML = wordsOnPage[j].word;
          if (word.classList.contains('true-button') || e.key === 'ArrowRight'){
            if (wordsOnPage[j].wordTranslate === shuffled[j].wordTranslate) {
              trueWord.push(wordsOnPage[j]);
              instance.colorIndicator(true);
              result += 10;
            }
            result -= 10;
            instance.colorIndicator(false);
            falseWord.push(wordsOnPage[j]);
          }
          if (word.classList.contains('false-button') || e.key === 'ArrowLeft'){
            if(wordsOnPage[j].wordTranslate === shuffled[j].wordTranslate) {
              falseWord.push(wordsOnPage[j]);
              instance.colorIndicator(false);
              result -= 10;
            } 
            instance.colorIndicator(true);
            trueWord.push(wordsOnPage[j]); result += 10;
          }
          if (j === wordsOnPage.length-1){
          (instance.node.querySelector('.true-button') as HTMLButtonElement).disabled = true;
        }
        } j += 1;
        
        instance.node.querySelector('.result').innerHTML = `${result}`;
        instance.node.querySelector('.point-result').innerHTML = `${result}`;
        instance.node.querySelector('.right-count').innerHTML = `${trueWord.length}`;
        instance.node.querySelector('.right-cont').innerHTML ='';  
        for (let i = 0; i<trueWord.length; i++) {
          const rightWordCont = new Control(instance.node.querySelector('.right-cont'), 'div', 'word-cont');      
          new Control(rightWordCont.node, 'div', 'word', `${trueWord[i].word} - `);
          new Control(rightWordCont.node, 'div', 'translate', `${trueWord[i].wordTranslate}`);
        }
        instance.node.querySelector('.wrong-count').innerHTML = `${falseWord.length}`;
        instance.node.querySelector('.wrong-cont').innerHTML ='';  
        for (let i = 0; i < falseWord.length; i++) {
          const wrongWordCont = new Control(instance.node.querySelector('.wrong-cont'), 'div', 'word-cont');      
          new Control(wrongWordCont.node, 'div', 'word', `${falseWord[i].word} - `);
          new Control(wrongWordCont.node, 'div', 'translate', ` ${falseWord[i].wordTranslate}`);
        }
      }
      word.addEventListener('keydown', createResult.bind(null, this)) ;
      word.addEventListener('click', createResult.bind(null, this));})
  }

  private timer(): void {
    let counter = this.node.querySelector('.seconds');
    let interval: NodeJS.Timer, isStart = false;
    let count = 30;
    if (!isStart) {
      isStart = true;
      interval = setInterval( () => {
        if (count == 0 || ((this.node.querySelector('.true-button') as HTMLButtonElement).disabled === true)) {
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
