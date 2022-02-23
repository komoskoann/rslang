import Control from '../../../controls/control';
import Footer from '../../mainPage/footer';
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
    document.querySelector('.footer')?.remove();
  }

  destroy() {
    this.section.destroy();
    new Footer(document.body);
  }
}
