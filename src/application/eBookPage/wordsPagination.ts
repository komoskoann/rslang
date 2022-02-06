import Control from '../../controls/control';
import './pagination.css';
import pagination from './pagination.html';
import { IPagination } from './IPagination';

export default class WordsPagination extends Control {
  firstPage: number = 0;

  lastPage: number = 29;

  currentPage: number = 0;

  paginationElements: IPagination;

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

  goToUserPage(e: Event) {
    this.currentPage = +(e.target as HTMLInputElement).value;
  }
}
