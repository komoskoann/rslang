import Header from './mainPage/header';
import Main from './mainPage/main';
import Footer from './mainPage/footer';

export class Application {
  header: Header;
  main: Main;
  footer: Footer;

  constructor() {
    this.header = new Header(document.body);
    this.main = new Main(document.body);
    this.footer = new Footer(document.body);
  }
}
