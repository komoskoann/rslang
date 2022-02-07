import Control from '../../controls/control';
import WordCard from './wordCard';
import eBook from './eBook.html';
import '../../css/eBook.css';
import { IWordCard } from './IWordCard';
import WordsPagination from './wordsPagination';
import GetWords from '../service/getWords';
import LocalStorage from '../service/localStorage';
import './preloader.css';
import preloadHtml from './preloader.html';

export default class EBookSection extends Control {
  wordCards: WordCard[];

  private defaultEnglishLevel: number = 0;

  private currentEnglishLevel: number;

  private defaultWordsPage: number = 0;

  private currentWordsPage: number;

  wordCardsWrapper: Control<HTMLElement>;

  paginationWrapper: WordsPagination;

  service: GetWords = new GetWords();

  localStorage: LocalStorage = new LocalStorage();

  currentPageLSName: string = 'currentWordPage';

  currentLevelLSName: string = 'currentEngLevel';

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
    this.currentWordsPage = +this.localStorage.getFromLocalStorage(this.currentPageLSName) || this.defaultWordsPage;
    this.currentEnglishLevel = +this.localStorage.getFromLocalStorage(this.currentLevelLSName) || this.defaultEnglishLevel;
    this.wordCardsWrapper = new Control(this.node, 'div', 'word-cards-wrapper');
    this.paginationWrapper = new WordsPagination(this.node);
    this.getWords(this.currentWordsPage, this.currentEnglishLevel);
    this.navLevels();
    this.navPages();
  }

  async getWords(page: number, group: number) {
    const preloader = document.createElement('div');
    preloader.className = 'loader-wrapper';
    preloader.innerHTML = preloadHtml;
    this.wordCardsWrapper.node.append(preloader as HTMLElement);
    const words: IWordCard[] = await this.service.getWords(page, group);
    this.wordCardsWrapper.node.lastElementChild.remove();
    this.wordCards = words.map((word: IWordCard) => new WordCard(this.wordCardsWrapper.node, word));
    this.wordCards.forEach((word) => word.render());
  }

  navLevels() {
    this.node.querySelectorAll("[data-level]").forEach(level => {
      level.addEventListener('click', function(instance: EBookSection) {
        instance.currentEnglishLevel = +level.getAttribute('data-level');
        instance.currentWordsPage = instance.defaultWordsPage;
        instance.paginationWrapper.currentPage = instance.defaultWordsPage;
        instance.update();
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
        instance.update();
      }.bind(null, this),);
    })
  }

  update() {
    this.paginationWrapper.blockButtons(this.node);
    this.paginationWrapper.changePageNumber(this.node);
    this.wordCardsWrapper.node.innerHTML = '';
    this.getWords(this.currentWordsPage, this.currentEnglishLevel);
    this.localStorage.setToLocalStorage(this.currentPageLSName, `${this.currentWordsPage}`);
    this.localStorage.setToLocalStorage(this.currentLevelLSName, `${this.currentEnglishLevel}`);
  }

}
