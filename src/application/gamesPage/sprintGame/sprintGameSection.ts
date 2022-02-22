import Control from '../../../controls/control';
import Footer from '../../mainPage/footer';
import '../../../css/sprintGame.css';
import MainSprintSection from './sprintMainSection';

export default class SprintGameSection {
  node: HTMLElement;

  section: Control<HTMLElement>;

  isReloadRequired: boolean = false;

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
