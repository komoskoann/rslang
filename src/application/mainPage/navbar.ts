import Control from '../../controls/control';

export default class Navbar extends Control {
  toMainButton: Control<HTMLElement>;

  toEbookButton: Control<HTMLElement>;

  toMiniGamesButton: Control<HTMLElement>;

  toStatisticsButton: Control<HTMLElement>;

  toDictionaryButton: Control<HTMLElement>;

  toAboutTeamButton: Control<HTMLElement>;

  navButtons: NodeListOf<ChildNode>;

  private main: string = 'main';

  private eBook: string = 'eBook';

  private miniGames: string = 'miniGames';

  private statistics: string = 'statistics';

  private dictionary: string = 'dictionary';

  private aboutTeam: string = 'aboutTeam';

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'nav', 'navbar', '');
    this.toMainButton = new Control(this.node, 'button', 'nav-button', 'to Main');
    this.toMainButton.node.id = this.main;
    this.toEbookButton = new Control(this.node, 'button', 'nav-button', 'to E-Book');
    this.toEbookButton.node.id = this.eBook;
    this.toMiniGamesButton = new Control(this.node, 'button', 'nav-button', 'to Mini Games');
    this.toMiniGamesButton.node.id = this.miniGames;
    this.toStatisticsButton = new Control(this.node, 'button', 'nav-button', 'to Statistics');
    this.toStatisticsButton.node.id = this.statistics;
    this.toDictionaryButton = new Control(this.node, 'button', 'nav-button', 'to Dictionary');
    this.toDictionaryButton.node.id = this.dictionary;
    this.toAboutTeamButton = new Control(this.node, 'button', 'nav-button', 'to About team');
    this.toAboutTeamButton.node.id = this.aboutTeam;
    this.navButtons = this.node.childNodes;
  }
}
