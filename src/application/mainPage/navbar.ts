import Control from '../../controls/control';

export default class Navbar extends Control {
  toMainButton: Control<HTMLElement>;
  toAuthorizationButton: Control<HTMLElement>;
  toEbookButton: Control<HTMLElement>;
  toMiniGamesButton: Control<HTMLElement>;
  toStatisticsButton: Control<HTMLElement>;
  toDictionaryButton: Control<HTMLElement>;
  toAboutTeamButton: Control<HTMLElement>;
  navButtons: NodeListOf<ChildNode>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'nav', 'navbar', '');
    this.toMainButton = new Control(this.node, 'button', 'nav-button', 'to Main', 'main');
    this.toAuthorizationButton = new Control(this.node, 'button', 'nav-button', 'to Authorization', 'authorization');
    this.toEbookButton = new Control(this.node, 'button', 'nav-button', 'to E-Book', 'eBook');
    this.toMiniGamesButton = new Control(this.node, 'button', 'nav-button', 'to Mini Games', 'miniGames');
    this.toStatisticsButton = new Control(this.node, 'button', 'nav-button', 'to Statistics', 'statistics');
    this.toDictionaryButton = new Control(this.node, 'button', 'nav-button', 'to Dictionary', 'dictionary');
    this.toAboutTeamButton = new Control(this.node, 'button', 'nav-button', 'to About team', 'aboutTeam');
    this.navButtons = this.node.childNodes;
  }

}
