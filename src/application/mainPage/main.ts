import Control from '../../controls/control';
import Navbar from '../mainPage/navbar';
import Router from '../router';

export default class Main extends Control {
  navbar: Navbar;

  router: Router = new Router();

  section: Control<HTMLElement>;

  navButtons: NodeListOf<ChildNode>;

  constructor(parentNode: HTMLElement, navButtons: NodeListOf<ChildNode>) {
    super(parentNode, 'main', 'main', '');
    this.navButtons = navButtons;
  }

  call() {
    this.section = new (this.router.resolve())(this.node);
    this.navigateApp();
  }

  private resolvePaths(path: string) {
    const newSection = this.router.resolve(path);
    if (this.section instanceof newSection && !this.section.isReloadRequired) {
      return;
    }
    this.section.destroy();
    this.section = new newSection(this.node);
  }

  private navigateApp() {
    this.navButtons.forEach((navButton) => {
      navButton.addEventListener(
        'click',
        function (mainInstance: Main) {
          mainInstance.resolvePaths((navButton as HTMLElement).id);
        }.bind(null, this),
      );
    });
  }
}
