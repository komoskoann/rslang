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
import tableHeader from './tableHeader.html';
import '../../css/tableEbook.css';

export default class EBookSection extends Control {
  wordCards: WordCard[];

  hardWordsDictionary: IWordCard[] = [];

  service: WordsController = new WordsController();

  localStorage: LocalStorage = new LocalStorage();

  private defaultEnglishLevel: number = 0;

  static currentEnglishLevel: number;

  private sourceEnglishLevel: number;

  private defaultWordsPage: number = 0;

  private currentWordsPage: number;

  private wordCardsWrapper: Control<HTMLElement>;

  private paginationWrapper: WordsPagination;

  private difficultWordsAmount: number;

  private isHard: boolean;

  private learntWordsAmount: number;

  words: IWordCard[];

  private tableHardWords: HTMLTableSectionElement;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'e-book', '');
    this.node.innerHTML = eBook;
    this.wordCardsWrapper = new Control(this.node, 'div', 'word-cards-wrapper');
    this.paginationWrapper = new WordsPagination(this.node);
    this.currentWordsPage =
      +this.localStorage.getFromLocalStorage(this.paginationWrapper.currentPageLSName) || this.defaultWordsPage;
    EBookSection.currentEnglishLevel = this.resolveCurrentLevel();
    this.isHard = !!getAuthorizedUser() && this.localStorage.getFromLocalStorage('isHard') === 'true';
    this.getWords(this.currentWordsPage, EBookSection.currentEnglishLevel, this.isHard);
    this.navLevels();
    this.navPages();
    this.enterUserPage();
    this.paginationWrapper.changePageNumber(this.node);
    this.highlightCurrentEnglishLevel();
  }

  private resolveCurrentLevel() {
    let levelFromStorage = +this.localStorage.getFromLocalStorage(this.paginationWrapper.currentLevelLSName);
    if (!getAuthorizedUser() && levelFromStorage === 6) {
      levelFromStorage = this.defaultEnglishLevel;
    }
    return levelFromStorage || this.defaultEnglishLevel;
  }

  private highlightCurrentEnglishLevel() {
    if (!this.isHard) {
      this.node
      .querySelector(`[data-level="${EBookSection.currentEnglishLevel}"]`)
      .setAttribute('style', 'background-color: var(--main-color-rgba-50);');
    } else {
      this.node.querySelector('[data-level="6"]')
      .setAttribute('style', 'background-color: var(--main-color-rgba-50);');
    }
  }

  private renderHardWordsDictionary(words: IWordCard[]): void {
    if (words.length) {
      this.wordCardsWrapper.node.innerHTML = tableHeader;
      this.tableHardWords = document.getElementById('tableHardWordsBody') as HTMLTableSectionElement;
      for (let i = 0; i < words.length; i++) {
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
        rowNumberCell.textContent = String(i + 1);
        rowWordCell.textContent = words[i].word.slice(0, 1).toUpperCase() + words[i].word.slice(1);
        rowTranscriptionCell.textContent = words[i].transcription;
        rowTranslateCell.textContent =
          words[i].wordTranslate.slice(0, 1).toUpperCase() + words[i].wordTranslate.slice(1);
        rowButtonDeleteCell.appendChild(buttonDelete);
        rowButtonAboutCell.appendChild(buttonAbout);
      }
      this.wordCardsWrapper.node.addEventListener('click', this.createWordCard);
      this.wordCardsWrapper.node.addEventListener('click', this.toggleHardWord);
    }
  }

  private createWordCard = (): void => {
    const target = (event.target as Element).closest('.table-button__about') as HTMLButtonElement;
    if (target) {
      const index = +target.closest('.table-row').querySelector('.col1-point').innerHTML - 1;
      const dictionaryCard = new WordCard(document.body, this.hardWordsDictionary[index], this.updateTotalCounter.bind(this));
      new Control(dictionaryCard.node, 'button', 'dictionary-card-close-button');
      dictionaryCard.node.classList.add('dictionary__card');
      dictionaryCard.render();
      (dictionaryCard.node.querySelector('.control-buttons-wrapper') as HTMLElement).style.display = 'none';
      setTimeout(() => dictionaryCard.node.classList.add('dictionary__card_active'), 0);
      setTimeout(() => window.addEventListener('click', this.closeWordCard), 0);
    }
  };

  private closeWordCard = (): void => {
    const closeButton = (event.target as Element).closest('.dictionary-card-close-button') as HTMLButtonElement;
    if (closeButton || !(event.target as Element).closest('.dictionary__card_active')) {
      const dictionaryCard = document.body.querySelector('.dictionary__card_active');
      if (dictionaryCard) {
        dictionaryCard.classList.remove('dictionary__card_active');
        setTimeout(() => dictionaryCard.parentNode.removeChild(dictionaryCard), 300);
      }
      window.removeEventListener('click', this.closeWordCard);
    }
  };

  private toggleHardWord = async (event: MouseEvent): Promise<void> => {
    const target = (event.target as Element).closest('.table-button__delete') as HTMLButtonElement;
    let row: HTMLElement;
    if (target) {
      row = target.closest('.table-row');
    } else return;
    const index = +target.closest('.table-row').querySelector('.col1-point').innerHTML - 1;
    if (row.classList.contains('removed')) {
      await this.service.changeUserWord(this.hardWordsDictionary[index].id, {
        difficulty: 'hard',
        optional: { isDifficult: true, isLearnt: false },
      });
      row.classList.remove('removed');
      row.style.setProperty('color', 'var(--text-color)');
      row
        .querySelectorAll('.table-button')
        .forEach((item) => (item as HTMLButtonElement).style.setProperty('filter', ''));
      target.style.backgroundImage = "url('../assets/ebook-page/delete-button.png')";
    } else {
      await this.service.changeUserWord(this.hardWordsDictionary[index].id, {
        difficulty: 'easy',
        optional: { isDifficult: false, isLearnt: false },
      });
      row.style.setProperty('color', 'var(--autorization-border-color)');
      row
        .querySelectorAll('.table-button')
        .forEach((item) =>
          (item as HTMLButtonElement).style.setProperty('filter', 'var(--dictionary-table-button-filter-color-hover)'),
        );
      row.classList.add('removed');
      target.style.backgroundImage = "url('../assets/ebook-page/revert-button.png')";
    }
  };

  private async getWords(page: number, group: number, isHard: boolean): Promise<void> {
    this.renderPreloader();
    if (isHard) {
      const array: IWordCard[] = await this.service.getHardUserWords();
      this.changeDesignHardWordsSection();
      if (array.length) {
        this.hardWordsDictionary = array;
        this.renderHardWordsDictionary(this.hardWordsDictionary);
      } else {
        this.renderEmptyHardWordsDictionary();
      }
    } else {
      this.renderPagination();
      if (getAuthorizedUser()) {
        this.words = await this.service.getUserAgrWords(page, group);
      } else {
        document.querySelector('.hard-word-cont').setAttribute('style', 'display: none');
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
  }

  private changeDesignHardWordsSection() {
    document.querySelector('.choose-page-number').classList.remove('learnt-page-number');
    document.querySelector('.to-sprint').classList.add('disable-game-buttons');
    document.querySelector('.to-chalenge').classList.add('disable-game-buttons');
    this.paginationWrapper.node.style.opacity = '0';
    this.paginationWrapper.node.style.visibility = 'hidden';
  }

  private renderPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'loader-wrapper';
    preloader.innerHTML = preloadHtml;
    this.wordCardsWrapper.node.append(preloader as HTMLElement);
  }

  private renderEmptyHardWordsDictionary() {
    this.wordCardsWrapper.node.lastElementChild.remove();
    const textNotice = document.createElement('p');
    textNotice.style.fontSize = '1.25rem';
    textNotice.style.fontWeight = '500';
    textNotice.textContent = `Привет, ${getAuthorizedUser().currentUser.name}! Ты пока не встретил сложных слов при изучении английского языка. Умница!`;
    this.wordCardsWrapper.node.appendChild(textNotice);
  }

  private renderPagination() {
    this.paginationWrapper.node.style.opacity = '1';
    this.paginationWrapper.node.style.visibility = 'visible';
  }

  private navLevels(): void {
    this.node.querySelectorAll('[data-level]').forEach((level) => {
      level.addEventListener(
        'click',
        function (instance: EBookSection) {
          instance.node.querySelector(`[data-level="${EBookSection.currentEnglishLevel}"]`).removeAttribute('style');
          instance.node.querySelector('[data-level="6"]').removeAttribute('style');
          const selectedLevel = +level.getAttribute('data-level');
          if (selectedLevel === 6) {
            location.replace('#/eBook/hardWords')
            instance.localStorage.setToLocalStorage('isHard', 'true');
            instance.isHard = true;
          } else {
            location.replace('#/eBook')
            instance.localStorage.setToLocalStorage('isHard', 'false');
            instance.isHard = false;
          }
          instance.sourceEnglishLevel = EBookSection.currentEnglishLevel;
          EBookSection.currentEnglishLevel = selectedLevel;
          instance.currentWordsPage = instance.defaultWordsPage;
          instance.paginationWrapper.currentPage = instance.defaultWordsPage;
          instance.update();
          instance.highlightCurrentEnglishLevel();
          if (instance.isHard) {
            instance.localStorage.setToLocalStorage(instance.paginationWrapper.currentLevelLSName, '6');
            location.reload();
          }
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
    await this.getWords(this.currentWordsPage, EBookSection.currentEnglishLevel, this.isHard);
    this.paginationWrapper.changePageNumber(this.node);
    this.localStorage.setToLocalStorage(this.paginationWrapper.currentPageLSName, `${this.currentWordsPage}`);
    this.localStorage.setToLocalStorage(this.paginationWrapper.currentLevelLSName, `${EBookSection.currentEnglishLevel}`);
    this.node.style.removeProperty('min-height');
    this.paginationWrapper.node.style.opacity = EBookSection.currentEnglishLevel === 6 ? '0' : '1';
    if (EBookSection.currentEnglishLevel !== 6 && this.sourceEnglishLevel !== 6) {
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

  private updateTotalCounter(counterChanged: string, operator: string) {
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

  private highlightLearntPage() {
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
