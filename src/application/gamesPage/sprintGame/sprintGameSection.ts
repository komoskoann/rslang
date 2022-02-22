import Control from '../../../controls/control';
import Footer from '../../mainPage/footer';
import '../../../css/sprintGame.css';
import SprintRouter from './sprintRouter';
import MainSprintSection from './sprintMainSection';
import LocalStorage from '../../services/words/localStorage';

export default class SprintGameSection {
  sprintRouter: SprintRouter = new SprintRouter();

  node: HTMLElement;

  section: Control<HTMLElement>;

  isReloadRequired: boolean = false;

  localStorage: LocalStorage = new LocalStorage();

  from: string = 'from';

  constructor(parentNode: HTMLElement) {
    this.node = parentNode;
    this.section = new MainSprintSection(parentNode);
    document.body.lastChild.remove();
    this.navigateStart();
  }

  destroy() {
    this.section.destroy();
    new Footer(document.body);
  }

  private resolvePath(path: string) {
    const newSection = this.sprintRouter.resolve(path);
    if (this.section instanceof newSection) {
      return;
    }
    this.section.destroy();
    this.section = new newSection(this.node);
  }

  private navigateStart() {    
    this.node.querySelector('.start-button').addEventListener(
        'click',
        function (instance: SprintGameSection) {
          instance.localStorage.setToLocalStorage(instance.from, `game`);
          instance.resolvePath((instance.node.querySelector('.start-button') as HTMLElement).id);
          instance.isReloadRequired = true;
      }.bind(null, this),
    );
  };
}
