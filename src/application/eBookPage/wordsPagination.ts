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
    const buttons = instance.querySelectorAll(this.buttonsClassName);
    if (this.currentPage === this.firstPage) {
      this.blockEvents(buttons[0] as HTMLElement);
      this.blockEvents(buttons[1] as HTMLElement);
      this.unblockEvents(buttons[2] as HTMLElement);
      this.unblockEvents(buttons[3] as HTMLElement);
    } else if (this.currentPage === this.lastPage) {
      this.blockEvents(buttons[2] as HTMLElement);
      this.blockEvents(buttons[3] as HTMLElement);
      this.unblockEvents(buttons[0] as HTMLElement);
      this.unblockEvents(buttons[1] as HTMLElement);
    }

  }

  blockEvents(button: HTMLElement) {
    button.classList.add('block-buttons');
  }

  unblockEvents(button: HTMLElement) {
    button.classList.remove('block-buttons');
  }

}
