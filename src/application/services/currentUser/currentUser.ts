export interface ICurrentUser {
  authenticatedStatus: boolean;
  name: string | null;
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
}

export default class CurrentUser implements ICurrentUser {
  authenticatedStatus: boolean;

  name: string | null;

  token: string | null;

  refreshToken: string | null;

  userId: string | null;

  constructor() {
    this.authenticatedStatus = JSON.parse(localStorage.getItem('currentUser'))?.message === 'Authenticated';
    this.name = JSON.parse(localStorage.getItem('currentUser'))?.name || null;
    this.token = JSON.parse(localStorage.getItem('currentUser'))?.token || null;
    this.refreshToken = JSON.parse(localStorage.getItem('currentUser'))?.refreshToken || null;
    this.userId = JSON.parse(localStorage.getItem('currentUser'))?.userId || null;
  }
}
