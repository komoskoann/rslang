import Control from '../../controls/control';
import WordCard from './wordCard';
import eBook from './eBook.html';
import '../../css/eBook.css';
import { IWordCard } from './ebookInterface';
import WordsPagination from './wordsPagination';
import WordsController from '../services/words/wordsController';
import LocalStorage from '../services/words/localStorage';
import '../../css/preloader.css';
import preloadHtml from './preloader.html';
import { app } from '../..';

export default class EBookSection extends Control {
  wordCards: WordCard[];

  service: WordsController = new WordsController();

  localStorage: LocalStorage = new LocalStorage();

  private defaultEnglishLevel: number = 0;

  private currentEnglishLevel: number;

  private sourceEnglishLevel: number;

  private defaultWordsPage: number = 0;

  private currentWordsPage: number;

  private wordCardsWrapper: Control<HTMLElement>;

  private paginationWrapper: WordsPagination;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
    this.wordCardsWrapper = new Control(this.node, 'div', 'word-cards-wrapper');
    this.paginationWrapper = new WordsPagination(this.node);
    this.currentWordsPage =
      +this.localStorage.getFromLocalStorage(this.paginationWrapper.currentPageLSName) || this.defaultWordsPage;
    this.currentEnglishLevel =
      +this.localStorage.getFromLocalStorage(this.paginationWrapper.currentLevelLSName) || this.defaultEnglishLevel;
    this.getWords(this.currentWordsPage, this.currentEnglishLevel);
    this.navLevels();
    this.navPages();
    this.enterUserPage();
    this.paginationWrapper.changePageNumber(this.node);
    this.renderHardWordsButton();
  }

  private async getWords(page: number, group: number): Promise<void> {
    const preloader = document.createElement('div');
    preloader.className = 'loader-wrapper';
    preloader.innerHTML = preloadHtml;
    this.wordCardsWrapper.node.append(preloader as HTMLElement);
    const words: IWordCard[] = await this.service.getWords(page, group);
    this.wordCardsWrapper.node.lastElementChild.remove();
    this.wordCards = words.map((word: IWordCard) => new WordCard(this.wordCardsWrapper.node, word));
    this.wordCards.forEach((word) => word.render());
  }

  private navLevels(): void {
    this.node.querySelectorAll('[data-level]').forEach((level) => {
      level.addEventListener(
        'click',
        function (instance: EBookSection) {
          instance.sourceEnglishLevel = instance.currentEnglishLevel;
          instance.currentEnglishLevel = +level.getAttribute('data-level');
          instance.currentWordsPage = instance.defaultWordsPage;
          instance.paginationWrapper.currentPage = instance.defaultWordsPage;
          instance.update();

          level.setAttribute('style', 'background-color: rgba(255, 193, 7, 0.8);')
        }.bind(null, this),
      );
    });
  }

  changeColorActiveLevel(e: Event) {
    const level = e.target;
    console.log(e, e.target);
  }

  private navPages(): void {
    if (!+this.localStorage.getFromLocalStorage(this.paginationWrapper.currentPageLSName)) {
      this.paginationWrapper.blockButtons(this.node);
    }
    this.node.querySelectorAll('[data-nav]').forEach((nav) => {
      nav.addEventListener(
        'click',
        function (instance: EBookSection) {
          if (+nav.getAttribute('data-nav') === instance.paginationWrapper.firstPage) {
            instance.currentWordsPage = instance.paginationWrapper.goToFirstPage();
          } else if (+nav.getAttribute('data-nav') === instance.paginationWrapper.lastPage) {
            instance.currentWordsPage = instance.paginationWrapper.goToLastPage();
          } else if (nav.getAttribute('data-nav') === instance.paginationWrapper.nextButtonDataAttr) {
            instance.currentWordsPage = instance.paginationWrapper.goToNextPage();
          } else if (nav.getAttribute('data-nav') === instance.paginationWrapper.prevButtonDataAttr) {
            instance.currentWordsPage = instance.paginationWrapper.goToPrevPage();
          }
          instance.sourceEnglishLevel = null;
          instance.update();
        }.bind(null, this),
      );
    });
  }

  private enterUserPage(): void {
    const inputElement = this.node.querySelector(this.paginationWrapper.inputClassName);
    inputElement.addEventListener(
      'change',
      function (instance: EBookSection) {
        let userNumber = instance.paginationWrapper.goToUserPage(inputElement);
        instance.currentWordsPage = userNumber;
        instance.update();
      }.bind(null, this),
    );
  }

  private async update(): Promise<void> {
    this.paginationWrapper.blockButtons(this.node);
    const oldWindowPageYBottom =
      document.body.clientHeight - (window.pageYOffset + document.documentElement.clientHeight);
    this.node.style.minHeight = getComputedStyle(this.node).height;
    this.wordCardsWrapper.node.innerHTML = '';
    await this.getWords(this.currentWordsPage, this.currentEnglishLevel);
    this.paginationWrapper.changePageNumber(this.node);
    this.localStorage.setToLocalStorage(this.paginationWrapper.currentPageLSName, `${this.currentWordsPage}`);
    this.localStorage.setToLocalStorage(this.paginationWrapper.currentLevelLSName, `${this.currentEnglishLevel}`);
    this.node.style.removeProperty('min-height');
    this.paginationWrapper.node.style.opacity = this.currentEnglishLevel === 6 ? '0' : '1';
    if (this.currentEnglishLevel !== 6 && this.sourceEnglishLevel !== 6) {
      this.scrollWindow(oldWindowPageYBottom);
    }
  }

  private scrollWindow(oldWindowPageYBottom: number): void {
    let scroolYValue =
      oldWindowPageYBottom < document.querySelector('.footer').clientHeight + document.querySelector('.pagination-wrapper').clientHeight
        ? document.body.clientHeight - oldWindowPageYBottom - document.documentElement.clientHeight
        : window.pageYOffset;
    window.scrollTo({
      top: scroolYValue,
      behavior: 'auto',
    });
  }

  private renderHardWordsButton() {
    if(app.currentUser.isAuthenticated) {
      document.querySelector('.hard-word-cont').setAttribute('style', 'display: flex');
    }
  }
}
