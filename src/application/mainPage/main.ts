import Control from '../../controls/control';
import Navbar from '../mainPage/navbar';
import Router from '../router';

export default class Main extends Control {
  navbar: Navbar;
  router: Router;
  section: Control<HTMLElement>;
  

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'main', 'main', '');
    this.navbar = new Navbar(this.node);
    this.router = new Router();
    this.section = new (this.router.resolve())(this.node);
    this.navigateApp();
  }
  
  private resolvePaths(path: string) {
    const newSection = this.router.resolve(path);
    if (this.section instanceof newSection) {
      return;
    }
    this.section.destroy();
    this.section = new newSection(this.node);
  }

  private navigateApp() {
    this.navbar.navButtons.forEach(navButton => {
      navButton.addEventListener('click', (function(mainInstance: Main) {
        mainInstance.resolvePaths((navButton as HTMLElement).id);
      }).bind(null, this))
    })
  }

}
