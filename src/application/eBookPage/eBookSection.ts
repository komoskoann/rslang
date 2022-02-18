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
import { getAuthorizedUser } from '../services/authorizationService/authorizedUser';

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

  private difficultWordsAmount: number;

  private learntWordsAmount: number;

  words: IWordCard[];

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
    this.highlightCurrentEnglishLevel();
  }

  private highlightCurrentEnglishLevel() {
    this.node
      .querySelector(`[data-level="${this.currentEnglishLevel}"]`)
      .setAttribute('style', 'background-color: var(--main-color-rgba-50);');
  }

  private async getWords(page: number, group: number): Promise<void> {
    const preloader = document.createElement('div');
    preloader.className = 'loader-wrapper';
    preloader.innerHTML = preloadHtml;
    this.wordCardsWrapper.node.append(preloader as HTMLElement);
    if (getAuthorizedUser()) {
      this.words = await this.service.getUserAgrWords(page, group);
    } else {
      this.words = await this.service.getWords(page, group);
    }
    this.wordCardsWrapper.node.lastElementChild.remove();
    this.wordCards = this.words.map(
      (word: IWordCard) => new WordCard(this.wordCardsWrapper.node, word, this.updateTotalCounter.bind(this)),
    );
    this.wordCards.forEach((word) => word.render());
    this.difficultWordsAmount = this.words.filter((word) => word.userWord?.optional?.isDifficult).length;
    this.learntWordsAmount = this.words.filter((word) => word.userWord?.optional?.isLearnt).length;
    this.highlightLearntPage();
  }

  private navLevels(): void {
    this.node.querySelectorAll('[data-level]').forEach((level) => {
      level.addEventListener(
        'click',
        function (instance: EBookSection) {
          instance.node.querySelector(`[data-level="${instance.currentEnglishLevel}"]`).removeAttribute('style');
          instance.sourceEnglishLevel = instance.currentEnglishLevel;
          instance.currentEnglishLevel = +level.getAttribute('data-level');
          instance.currentWordsPage = instance.defaultWordsPage;
          instance.paginationWrapper.currentPage = instance.defaultWordsPage;
          instance.update();
          instance.highlightCurrentEnglishLevel();
        }.bind(null, this),
      );
    });
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
    this.highlightLearntPage();
  }

  private scrollWindow(oldWindowPageYBottom: number): void {
    let scrollYValue =
      oldWindowPageYBottom <
      document.querySelector('.footer').clientHeight + document.querySelector('.pagination-wrapper').clientHeight
        ? document.body.clientHeight - oldWindowPageYBottom - document.documentElement.clientHeight
        : window.pageYOffset;
    window.scrollTo({
      top: scrollYValue,
      behavior: 'auto',
    });
  }

  private renderHardWordsButton() {
    if (JSON.parse(localStorage.getItem('currentUser'))) {
      document.querySelector('.hard-word-cont').setAttribute('style', 'display: flex');
    }
  }

  updateTotalCounter(counterChanged: string, operator: string) {
    if (counterChanged === 'difficult') {
      if (operator === '+') {
        this.difficultWordsAmount += 1;
      } else {
        this.difficultWordsAmount -= 1;
      }
    }
    if (counterChanged === 'learnt') {
      if (operator === '+') {
        this.learntWordsAmount += 1;
      } else {
        this.learntWordsAmount -= 1;
      }
    }
    this.highlightLearntPage();
  }

  highlightLearntPage() {
    if (this.learntWordsAmount === 20 || this.difficultWordsAmount + this.learntWordsAmount === 20) {
      this.wordCardsWrapper.node.classList.add('page-learnt');
      document.querySelector('.choose-page-number').classList.add('learnt-page-number');
      document.querySelector('.to-sprint').classList.add('disable-game-buttons');
      document.querySelector('.to-chalenge').classList.add('disable-game-buttons');
    } else {
      this.wordCardsWrapper.node.classList.remove('page-learnt');
      document.querySelector('.choose-page-number').classList.remove('learnt-page-number');
      document.querySelector('.to-sprint').classList.remove('disable-game-buttons');
      document.querySelector('.to-chalenge').classList.remove('disable-game-buttons');
    }
  }
}
