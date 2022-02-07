export interface ICurrentUser {
  authenticatedStatus: boolean;
  name: string;
  token: string;
  refreshToken: string;
  userId: string;
}

export default class CurrentUser implements ICurrentUser {
  authenticatedStatus: boolean;

  name: string;

  token: string;

  refreshToken: string;

  userId: string;

  constructor() {
    this.authenticatedStatus = JSON.parse(localStorage.getItem('currentUser'))?.message === 'Authenticated';
    this.name = JSON.parse(localStorage.getItem('currentUser'))?.name || null;
    this.token = JSON.parse(localStorage.getItem('currentUser'))?.token || null;
    this.refreshToken = JSON.parse(localStorage.getItem('currentUser'))?.refreshToken || null;
    this.userId = JSON.parse(localStorage.getItem('currentUser'))?.userId || null;
  }
}
