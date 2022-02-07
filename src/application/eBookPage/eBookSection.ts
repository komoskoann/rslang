import Control from '../../controls/control';
import WordCard from './wordCard';
import eBook from './eBook.html';
import '../../css/eBook.css';
import { IWordCard } from './IWordCard';
import WordsPagination from './wordsPagination';
import GetWords from '../services/words/getWords';
import LocalStorage from '../services/words/localStorage';
import '../../css/preloader.css';
import preloadHtml from './preloader.html';

export default class EBookSection extends Control {
  wordCards: WordCard[];

  private defaultEnglishLevel: number = 0;

  private currentEnglishLevel: number;

  private defaultWordsPage: number = 0;

  private currentWordsPage: number;

  private wordCardsWrapper: Control<HTMLElement>;

  private paginationWrapper: WordsPagination;

  service: GetWords = new GetWords();

  localStorage: LocalStorage = new LocalStorage();

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
    this.wordCardsWrapper = new Control(this.node, 'div', 'word-cards-wrapper');
    this.paginationWrapper = new WordsPagination(this.node);
    this.currentWordsPage = +this.localStorage.getFromLocalStorage(this.paginationWrapper.currentPageLSName) || this.defaultWordsPage;
    this.currentEnglishLevel = +this.localStorage.getFromLocalStorage(this.paginationWrapper.currentLevelLSName) || this.defaultEnglishLevel;
    this.getWords(this.currentWordsPage, this.currentEnglishLevel);
    this.navLevels();
    this.navPages();
    this.enterUserPage();
    this.paginationWrapper.changePageNumber(this.node);
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

  private navLevels() {
    this.node.querySelectorAll("[data-level]").forEach(level => {
      level.addEventListener('click', function(instance: EBookSection) {
        instance.currentEnglishLevel = +level.getAttribute('data-level');
        instance.currentWordsPage = instance.defaultWordsPage;
        instance.paginationWrapper.currentPage = instance.defaultWordsPage;
        instance.update();
      }.bind(null, this),);
    })
  }

  private navPages() {
    if(!+this.localStorage.getFromLocalStorage(this.paginationWrapper.currentPageLSName)) {
      this.paginationWrapper.blockButtons(this.node);
    }
    this.node.querySelectorAll("[data-nav]").forEach(nav => {
      nav.addEventListener('click', function(instance: EBookSection) {
        if(+nav.getAttribute('data-nav') === instance.paginationWrapper.firstPage) {
          instance.currentWordsPage = instance.paginationWrapper.goToFirstPage();
        } else if(+nav.getAttribute('data-nav') === instance.paginationWrapper.lastPage) {
          instance.currentWordsPage = instance.paginationWrapper.goToLastPage();
        } else if(nav.getAttribute('data-nav') === instance.paginationWrapper.nextButtonDataAttr) {
          instance.currentWordsPage = instance.paginationWrapper.goToNextPage();
        } else if(nav.getAttribute('data-nav') === instance.paginationWrapper.prevButtonDataAttr) {
          instance.currentWordsPage = instance.paginationWrapper.goToPrevPage();
        }
        instance.update();
      }.bind(null, this),);
    })
  }

  private enterUserPage() {
    const inputElement = this.node.querySelector(this.paginationWrapper.inputClassName);
    inputElement.addEventListener('change', function(instance: EBookSection) {
      let userNumber = instance.paginationWrapper.goToUserPage(inputElement);
      instance.currentWordsPage = userNumber;
      instance.update();
    }.bind(null, this),)
  }

  private update() {
    this.paginationWrapper.blockButtons(this.node);
    this.wordCardsWrapper.node.innerHTML = '';
    this.getWords(this.currentWordsPage, this.currentEnglishLevel);
    this.paginationWrapper.changePageNumber(this.node);
    this.localStorage.setToLocalStorage(this.paginationWrapper.currentPageLSName, `${this.currentWordsPage}`);
    this.localStorage.setToLocalStorage(this.paginationWrapper.currentLevelLSName, `${this.currentEnglishLevel}`);
  }

}
