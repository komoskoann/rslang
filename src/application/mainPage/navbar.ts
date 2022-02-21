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

  private aboutTeam: string = 'aboutTeam';

  private navbarCol: string = 'navbarTogglerDemo03';

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'nav', 'menu navbar navbar-expand-lg navbar-light', '');
    const divContainerFluid = new Control(this.node, 'div', 'nav-cont container-fluid');
    divContainerFluid.node.innerHTML = `
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>`;
    const divNavbarCol = new Control(divContainerFluid.node, 'div', 'collapse navbar-collapse');
    divNavbarCol.node.id = this.navbarCol;
    const ulNavig = new Control(divNavbarCol.node, 'ul', 'navbar-nav me-auto mb-2 mb-lg-0');
    this.toMainButton = new Control(ulNavig.node, 'li', 'menu-list  nav-item', 'to Main');
    this.toMainButton.node.id = this.main;
    this.toMainButton.node.innerHTML = '<a class="nav-main nav-link"  href="#">Главная</a>';
    this.toEbookButton = new Control(ulNavig.node, 'li', 'menu-list  nav-item', 'to E-Book');
    this.toEbookButton.node.id = this.eBook;
    this.toEbookButton.node.innerHTML = '<a class="nav-book nav-link" href="#/eBook">Учебник</a>';
    this.toMiniGamesButton = new Control(ulNavig.node, 'li', 'menu-list  nav-item', 'to Mini Games');
    this.toMiniGamesButton.node.id = this.miniGames;
    this.toMiniGamesButton.node.innerHTML = ' <a class="nav-link" href="#/miniGames">Игры</a>';
    this.toStatisticsButton = new Control(ulNavig.node, 'li', 'menu-list  nav-item', 'to Statistics');
    this.toStatisticsButton.node.id = this.statistics;
    this.toStatisticsButton.node.innerHTML = '<a class="nav-link" href="#/statistics">Статистика</a>';
    this.toAboutTeamButton = new Control(ulNavig.node, 'li', 'menu-list  nav-item', 'to About team');
    this.toAboutTeamButton.node.id = this.aboutTeam;
    this.toAboutTeamButton.node.innerHTML = '<a class="nav-book nav-link" href="#/aboutTeam">О команде</a>';
    this.navButtons = ulNavig.node.childNodes;
  }
}
