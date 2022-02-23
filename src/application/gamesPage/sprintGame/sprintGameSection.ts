import Control from '../../../controls/control';
import '../../../css/sprintGame.css';
import MainSprintSection from './sprintMainSection';
import LocalStorage from '../../services/words/localStorage';

export default class SprintGameSection {
  node: HTMLElement;

  section: Control<HTMLElement>;

  isReloadRequired: boolean = false;

  localStorage: LocalStorage = new LocalStorage();

  from: string = 'from';

  constructor(parentNode: HTMLElement) {
    this.node = parentNode;
    this.section = new MainSprintSection(parentNode);
    this.localStorage.setToLocalStorage(this.from, 'game');
  }

  destroy() {
    this.section.destroy();
  }
}
