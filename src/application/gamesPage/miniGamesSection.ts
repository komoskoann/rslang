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
  }

  destroy() {
    this.section.destroy();
  }

}
