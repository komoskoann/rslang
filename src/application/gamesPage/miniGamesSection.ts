import Control from '../../controls/control';
import MiniGamesRouter from './miniGamesRouter';
import MiniGamesSelectorSection from './miniGamesSelectorSection';

export default class MiniGamesSection {
  miniGamesRouter: MiniGamesRouter = new MiniGamesRouter();

  section: Control<HTMLElement>;

  node: HTMLElement;

  isReloadRequired: boolean = false;

  constructor(parentNode: HTMLElement) {
    this.node = parentNode;
    this.section = new MiniGamesSelectorSection(parentNode);
    // this.navigateGames();
  }

  destroy() {
    this.section.destroy();
  }

  // private resolvePaths(path: string) {
  //   const newSection = this.miniGamesRouter.resolve(path);
  //   if (this.section instanceof newSection) {
  //     return;
  //   }
  //   this.section.destroy();
  //   this.section = new newSection(this.node);
  // }

  // private getButtons(): NodeListOf<ChildNode> {
  //   return this.node.querySelectorAll('.games-nav-button');
  // }

  // private navigateGames() {
  //   this.getButtons().forEach((gameNavButton) => {
  //     gameNavButton.addEventListener(
  //       'click',
  //       function (mainInstance: MiniGamesSection) {
  //         mainInstance.resolvePaths((gameNavButton as HTMLElement).id);
  //         mainInstance.isReloadRequired = true;
  //       }.bind(null, this),
  //     );
  //   });
  // }
}
