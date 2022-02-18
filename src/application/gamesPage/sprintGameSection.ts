import Control from '../../controls/control';
import Footer from '../mainPage/footer';
import sprintSection from './sprintGameSection.html';
import sprintGameCard from './sprintGameCard.html';
import '../../css/sprintGame.css';
import { IWordCard } from '../eBookPage/ebookInterface';
import GetWordsToSprint from '../services/sprintGame/getWordsToSprint';
import WordCard from '../eBookPage/wordCard';

export default class SprintGameSection extends Control {
  wordCards: WordCard[];

  service: GetWordsToSprint = new GetWordsToSprint();

  private currentEnglishLevel: number;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'sprint-game-section');
    this.node.innerHTML = sprintSection;
    this.toggleToStart();
    this.navLevels();
    document.body.lastChild.remove();
  }

  async getWords(group: number): Promise<void> {
    let allwords = [];
    for (let i = 0; i < 30; i++) {
      let wordsOnPage: IWordCard[] = await this.service.getWordstoSprint(i, group);
      allwords.push(wordsOnPage);
    }
    let shuffled = allwords
      .flat()
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, 30);
    console.log(shuffled);
    console.log(shuffled[0].word);
    console.log(shuffled[1].wordTranslate);
    this.node.querySelector('.word-name').innerHTML = shuffled[0].word;
    this.node.querySelector('.word-translation').innerHTML = shuffled[1].wordTranslate;
  }

  private navLevels(): void {
    this.node.querySelectorAll('[level]').forEach((level) => {
      level.addEventListener(
        'click',
        function (instance: SprintGameSection) {
          (instance.node.querySelector('.start-button') as HTMLButtonElement).disabled = false;
          instance.currentEnglishLevel = +level.getAttribute('level');
        }.bind(null, this),
      );
    });
  }

  private timer(): void {
    let counter = this.node.querySelector('.seconds');
    let interval: NodeJS.Timer,
      isStart = false;
    let count = 30;
    if (!isStart) {
      isStart = true;
      interval = setInterval(function () {
        if (count == 0) {
          clearInterval(interval);
        }
        if (count < 10) counter.textContent = '0' + count--;
        else counter.textContent = '' + count--;
      }, 1000);
    }
  }

  private toggleToStart(): void {
    this.node.querySelector('.start-button').addEventListener('click', () => {
      this.node.querySelector('.sprint-section').classList.add('start');
      const cardSprint = new Control(this.node, 'div', 'card-sprint container-xxl');
      cardSprint.node.innerHTML = sprintGameCard;
      const englishWord = new Control(this.node.querySelector('.card-translate'), 'div', 'word-english');
      new Control(englishWord.node, 'span', 'word-name');
      new Control(this.node.querySelector('.card-translate'), 'div', '', 'это');
      const russianWord = new Control(this.node.querySelector('.card-translate'), 'div', 'word-russian');
      new Control(russianWord.node, 'span', 'word-translation');
      this.getWords(this.currentEnglishLevel);
      setTimeout(() => {
        this.timer();
      }, 5000);
    });
  }

  destroy() {
    super.destroy();
    new Footer(document.body);
  }
}
