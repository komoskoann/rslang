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
import tableHeader from './tableHeader.html';
import '../../css/tableEbook.css';
import GetUserWords from '../services/users/userWords';
import { app } from '../..';

interface IWord {
  wordId: string,
  id: string,
  difficulty: string
}

export default class EBookSection extends Control {
  wordCards: WordCard[];

  service: GetWords = new GetWords();

  localStorage: LocalStorage = new LocalStorage();

  private defaultEnglishLevel: number = 0;

  private currentEnglishLevel: number;

  private sourceEnglishLevel: number;

  private defaultWordsPage: number = 0;

  private currentWordsPage: number;

  private wordCardsWrapper: Control<HTMLElement>;

  private paginationWrapper: WordsPagination;

  private tableHardWords: HTMLTableSectionElement;

  servicewords: GetUserWords = new GetUserWords();

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
  }

  private async renderHardWordsDictionary(words: IWordCard[]) {
    /* console.log(words) */
    if (words.length) {
      this.wordCardsWrapper.node.innerHTML = tableHeader;
      this.tableHardWords = document.getElementById('tableHardWordsBody') as HTMLTableSectionElement;
      for (let i = 0; i < words.length; i++) {
        /* console.log(words[i]) */
        const row = this.tableHardWords.insertRow();
        const rowNumberCell = row.insertCell();
        const rowWordCell = row.insertCell();
        const rowTranscriptionCell = row.insertCell();
        const rowTranslateCell = row.insertCell();
        const rowButtonAboutCell = row.insertCell();
        const rowButtonDeleteCell = row.insertCell();
        row.classList.add('table-row');
        rowNumberCell.className = 'cell-center col1-point';
        rowWordCell.classList.add('cell-center');
        rowTranscriptionCell.classList.add('cell-center');
        rowTranslateCell.classList.add('cell-center');
        const buttonDelete = document.createElement('button');
        const buttonAbout = document.createElement('button');
        buttonDelete.className = 'table-button table-button__delete';
        buttonAbout.className = 'table-button table-button__about';
        rowButtonDeleteCell.className = 'button-container col-button-delete';
        rowButtonAboutCell.className = 'button-container col-button-about';
        rowNumberCell.textContent = String(i+1);
        rowWordCell.textContent = words[i].word.slice(0,1).toUpperCase() + words[i].word.slice(1);
        rowTranscriptionCell.textContent = words[i].transcription;
        rowTranslateCell.textContent = words[i].wordTranslate.slice(0,1).toUpperCase() + words[i].wordTranslate.slice(1);
        rowButtonDeleteCell.appendChild(buttonDelete);
        rowButtonAboutCell.appendChild(buttonAbout);
        buttonDelete.addEventListener('click', this.toggleHardWeakWord);
      }
    }
  }

  private async toggleHardWeakWord() {
    console.log(this);
    console.log(this.node)
/*     if (this.node.closest('.table-row').classList.contains('.weak')) {
      this.node.closest('.table-row').classList.remove('weak');
      this.node.style.backgroundImage = '../assets/ebook-page/delete-button.png';
    } else {
      this.node.closest('.table-row').classList.add('weak');
      this.node.style.backgroundImage = '../assets/ebook-page/revert-button.png';
    } */
  }

  private async getWords(page: number, group: number): Promise<void> {
    const preloader = document.createElement('div');
    preloader.className = 'loader-wrapper';
    preloader.innerHTML = preloadHtml;
    this.wordCardsWrapper.node.append(preloader as HTMLElement);
    if (group === 6) {
      const array: [] = await this.servicewords.getUserWords(app.currentUser);
      let words: IWordCard[] = [];
      this.paginationWrapper.node.style.opacity = '0';
      if (array.length) {
        for (let i = 0; i < array.length; i++) {
          let x = await this.service.getWord((array[i] as IWord).wordId);
          words.push(x);
        }
        this.renderHardWordsDictionary(words);
      }
    } else {
      const words: IWordCard[] = await this.service.getWords(page, group);
      this.wordCardsWrapper.node.lastElementChild.remove();
      this.wordCards = words.map((word: IWordCard) => new WordCard(this.wordCardsWrapper.node, word));
      this.wordCards.forEach((word) => word.render());
    }
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
}
