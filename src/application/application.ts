import Header from './mainPage/header';
import Navbar from './mainPage/navbar';
import Main from './mainPage/main';
import Footer from './mainPage/footer';
import CurrentUser, { ICurrentUser } from './services/currentUser/currentUser';

export class Application {
  header: Header;

  navbar: Navbar;

  main: Main;

  footer: Footer;

  currentUser: ICurrentUser;

  constructor() {
    this.header = new Header(document.body);
    this.navbar = new Navbar(document.body);
    this.main = new Main(document.body, this.navbar.navButtons);
    this.main.call();
    this.footer = new Footer(document.body);
    this.currentUser = new CurrentUser();
    console.log(this.currentUser); // индикатор
  }

  signOut(): ICurrentUser {
    localStorage.removeItem('currentUser');
    return new CurrentUser();
  }
}
