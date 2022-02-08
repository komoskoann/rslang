import { app } from "../../..";

export default class CurrentUser {
  isAuthenticated: boolean;

  name: string;

  token: string;

  refreshToken: string;

  userId: string;

  constructor() {
    this.isAuthenticated = JSON.parse(localStorage.getItem('currentUser'))?.message === 'Authenticated';
    this.name = JSON.parse(localStorage.getItem('currentUser'))?.name || null;
    this.token = JSON.parse(localStorage.getItem('currentUser'))?.token || null;
    this.refreshToken = JSON.parse(localStorage.getItem('currentUser'))?.refreshToken || null;
    this.userId = JSON.parse(localStorage.getItem('currentUser'))?.userId || null;
  }

  signOut(): void {
    localStorage.removeItem('currentUser');
    app.currentUser = new CurrentUser();
  }
}
