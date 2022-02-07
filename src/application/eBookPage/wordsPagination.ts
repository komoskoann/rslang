import Control from '../../controls/control';
import '../../css/pagination.css';
import pagination from './pagination.html';
import LocalStorage from '../services/words/localStorage';

export default class WordsPagination extends Control {
  firstPage: number = 0;

  lastPage: number = 29;

  currentPage: number = 0;

  inputClassName: string = '.input-page-number';

  private buttonsClassName: string = '.pagination-button';

  nextButtonDataAttr: string = 'to-next-page';

  prevButtonDataAttr: string = 'to-prev-page';

  private numOfLeftButtons: number = 2;

  private classNameForBlockButtons: string = 'block-buttons';

  localStorage: LocalStorage = new LocalStorage();

  currentPageLSName: string = 'currentWordPage';

  currentLevelLSName: string = 'currentEngLevel';

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'pagination-wrapper');
    this.node.innerHTML = pagination;
    this.currentPage = +this.localStorage.getFromLocalStorage(this.currentPageLSName) || this.firstPage;
  }

  goToFirstPage() {
    return (this.currentPage = this.firstPage);
  }

  goToLastPage() {
    return (this.currentPage = this.lastPage);
  }

  goToNextPage() {
    if (this.currentPage < this.lastPage) {
      return (this.currentPage += 1);
    }
  }

  goToPrevPage() {
    if (this.currentPage > this.firstPage) {
      return (this.currentPage -= 1);
    }
  }

  goToUserPage(e: EventTarget) {
    const userPageInput = +(e as HTMLInputElement).value;
    if (userPageInput < this.lastPage + 1 && userPageInput > this.firstPage + 1) {
      this.currentPage = userPageInput - 1;
    }
    return this.currentPage;
  }

  changePageNumber(instance: HTMLElement) {
    const element: HTMLInputElement = instance.querySelector(this.inputClassName);
    const pageNumber = this.currentPage + 1;
    element.value = `${pageNumber}`;
    return element.value;
  }

  blockButtons(instance: HTMLElement) {
    const buttons = Array.from(instance.querySelectorAll(this.buttonsClassName));
    if (this.currentPage === this.firstPage) {
      this.blockEvents(buttons.splice(0, this.numOfLeftButtons) as HTMLElement[]);
      this.unblockEvents(buttons as HTMLElement[]);
    } else if (this.currentPage === this.lastPage) {
      this.blockEvents(buttons.reverse().splice(0, this.numOfLeftButtons) as HTMLElement[]);
      this.unblockEvents(buttons as HTMLElement[]);
    } else {
      this.unblockEvents(buttons as HTMLElement[]);
    }
  }

  private blockEvents(buttons: HTMLElement[]) {
    buttons.forEach((button) => button.classList.add(this.classNameForBlockButtons));
  }

  private unblockEvents(buttons: HTMLElement[]) {
    buttons.forEach((button) => button.classList.remove(this.classNameForBlockButtons));
  }
}
