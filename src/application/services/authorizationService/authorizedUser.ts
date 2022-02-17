import { app } from '../../..';

export const getAuthorizedUser = () => {
  if (app?.currentUser?.isAuthenticated) {
    return app.currentUser;
  } else {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
