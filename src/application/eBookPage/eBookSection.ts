import Control from '../../controls/control';
import WordCard from './wordCard';
import eBook from './eBook.html';
import '../../css/eBook.css';
import { IWordCard } from './IWordCard';

export default class EBookSection extends Control {
  wordCards: WordCard[];

  private defaultEnglishLevel: number = 0;

  private currentEnglishLevel: number;

  private defaultWordsPage: number = 0;

  private numOfLevels: number = 6;

  private wordsPerPage: number = 20;

  private numOfPages: number = 30;

  wordCardsWrapper: Control<HTMLElement>;

  paginationWrapper: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
    this.wordCardsWrapper = new Control(this.node, 'div', 'word-cards-wrapper');
    this.paginationWrapper = new Control(this.node, 'div', 'pagination-wrapper');
    this.getWords(this.defaultWordsPage, this.defaultEnglishLevel);
    this.navLevels();
  }

  async getWord(id: string) {
    const rawResponse = await fetch(`https://rslangapplication.herokuapp.com/words/${id}`);
    const content = await rawResponse.json();
    console.log(content);
  }

  async getWords(page: number, group: number) {
    const rawResponse = await fetch(`https://rslangapplication.herokuapp.com/words?page=${page}&group=${group}`);
    const words: IWordCard[] = await rawResponse.json();
    this.wordCards = words.map((word: IWordCard) => new WordCard(this.wordCardsWrapper.node, word));
    this.wordCards.forEach((word) => word.render());
  }

  navLevels() {
    this.node.querySelectorAll("[data-level]").forEach(level => {
      level.addEventListener('click', function(instance: EBookSection) {
        instance.currentEnglishLevel = +level.getAttribute('data-level');
        instance.wordCardsWrapper.node.innerHTML = '';
        instance.getWords(instance.defaultWordsPage, instance.currentEnglishLevel);
      }.bind(null, this),);
    })
  }
}
