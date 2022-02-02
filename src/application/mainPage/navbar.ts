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
    this.toMainButton = new Control(this.node, 'button', 'nav-button', 'to Main');
    this.toMainButton.node.id = 'main';
    this.toAuthorizationButton = new Control(this.node, 'button', 'nav-button', 'to Authorization');
    this.toAuthorizationButton.node.id = 'authorization';
    this.toEbookButton = new Control(this.node, 'button', 'nav-button', 'to E-Book');
    this.toEbookButton.node.id = 'eBook';
    this.toMiniGamesButton = new Control(this.node, 'button', 'nav-button', 'to Mini Games');
    this.toMiniGamesButton.node.id = 'miniGames';
    this.toStatisticsButton = new Control(this.node, 'button', 'nav-button', 'to Statistics');
    this.toStatisticsButton.node.id = 'statistics';
    this.toDictionaryButton = new Control(this.node, 'button', 'nav-button', 'to Dictionary');
    this.toDictionaryButton.node.id = 'dictionary';
    this.toAboutTeamButton = new Control(this.node, 'button', 'nav-button', 'to About team');
    this.toAboutTeamButton.node.id = 'aboutTeam';
    this.navButtons = this.node.childNodes;
  }
}
