import Control from '../../controls/control';
import './pagination.css';
import pagination from './pagination.html';
import { IPagination } from './IPagination';

export default class WordsPagination extends Control {
  firstPage: number = 0;

  lastPage: number = 29;

  currentPage: number = 0;

  paginationElements: IPagination;

  inputClassName: string = '.input-page-number';

  buttonsClassName: string = '.pagination-button';

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'pagination-wrapper');
    this.node.innerHTML = pagination;
  }

  goToFirstPage() {
    return this.currentPage = this.firstPage;
  }

  goToLastPage() {
    return this.currentPage = this.lastPage;
  }

  goToNextPage() {
    if(this.currentPage < this.lastPage) {
      this.currentPage += 1;
    }
  }

  goToPrevPage() {
    if(this.currentPage > this.firstPage) {
      this.currentPage -= 1;
    }
  }

  goToUserPage(e: EventTarget) {
    this.currentPage = +(e as HTMLInputElement).value;
  }

  changePageNumber(instance: HTMLElement) {
    const element: HTMLInputElement = instance.querySelector(this.inputClassName);
    const pageNumber = this.currentPage + 1;
    element.value = `${pageNumber}`;
  }

  blockButtons(instance: HTMLElement) {
    const buttons = Array.from(instance.querySelectorAll(this.buttonsClassName));
    if (this.currentPage === this.firstPage) {
      this.blockEvents(buttons.splice(0, 2) as HTMLElement[]);
      this.unblockEvents(buttons as HTMLElement[]);
    } else if (this.currentPage === this.lastPage) {
      this.blockEvents(buttons.reverse().splice(0, 2) as HTMLElement[]);
      this.unblockEvents(buttons as HTMLElement[]);
    }
  }

  blockEvents(buttons: HTMLElement[]) {
    buttons.forEach(button => button.classList.add('block-buttons'));
  }

  unblockEvents(buttons: HTMLElement[]) {
    buttons.forEach(button => button.classList.remove('block-buttons'));
  }

}
