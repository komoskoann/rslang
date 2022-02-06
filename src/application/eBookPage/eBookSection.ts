import Control from '../../controls/control';
import WordCard from './wordCard';
import eBook from './eBook.html';
import '../../css/eBook.css';
import { IWordCard } from './IWordCard';
import WordsPagination from './wordsPagination';

export default class EBookSection extends Control {
  wordCards: WordCard[];

  private defaultEnglishLevel: number = 0;

  private currentEnglishLevel: number = this.defaultEnglishLevel;

  private defaultWordsPage: number = 0;

  private currentWordsPage: number = this.defaultWordsPage;

  wordCardsWrapper: Control<HTMLElement>;

  paginationWrapper: WordsPagination;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
    this.wordCardsWrapper = new Control(this.node, 'div', 'word-cards-wrapper');
    this.paginationWrapper = new WordsPagination(this.node);
    this.getWords(this.defaultWordsPage, this.defaultEnglishLevel);
    this.navLevels();
    this.navPages();
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
        instance.currentWordsPage = instance.defaultWordsPage;
        instance.paginationWrapper.changePageNumber(instance.node);
        instance.getWords(instance.currentWordsPage, instance.currentEnglishLevel);
      }.bind(null, this),);
    })
  }

  navPages() {
    this.paginationWrapper.blockButtons(this.node);
    this.node.querySelectorAll("[data-nav]").forEach(nav => {
      nav.addEventListener('click', function(instance: EBookSection) {
        if(+nav.getAttribute('data-nav') === instance.paginationWrapper.firstPage) {
          instance.currentWordsPage = instance.paginationWrapper.goToFirstPage();
        } else if(+nav.getAttribute('data-nav') === instance.paginationWrapper.lastPage) {
          instance.currentWordsPage = instance.paginationWrapper.goToLastPage();
        }
        instance.paginationWrapper.blockButtons(instance.node);
        instance.paginationWrapper.changePageNumber(instance.node);
        instance.wordCardsWrapper.node.innerHTML = '';
        instance.getWords(instance.currentWordsPage, instance.currentEnglishLevel);
      }.bind(null, this),);
    })
  }


}
