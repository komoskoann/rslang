import Control from '../../controls/control';
import teamPage from './team-page.html';
import '../../css/team-page.css';

export default class AboutTeamSection extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'team-page');
    this.node.innerHTML = teamPage;
  }
}
