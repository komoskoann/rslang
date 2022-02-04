import MainSection from '../application/mainPage/mainSection';
import EBookSection from '../application/eBookPage/eBookSection';
import MiniGamesSection from '../application/gamesPage/miniGamesSection';
import StatisticsSection from '../application/statisticsPage/statisticsSection';
import DictionarySection from '../application/dictionaryPage/dictionarySection';
import AboutTeamSection from '../application/aboutTeamPage/aboutTeamSection';

export default class Router {
  private defaultPath = 'main';

  path: string = this.defaultPath;

  private main: string = 'main';

  private eBook: string = 'eBook';

  private miniGames: string = 'miniGames';

  private statistics: string = 'statistics';

  private dictionary: string = 'dictionary';

  private aboutTeam: string = 'aboutTeam';

  resolve(path?: string) {
    this.path = path || this.defaultPath;
    let resolved;
    switch (path) {
      case this.main:
        resolved = MainSection;
        break;
      case this.eBook:
        resolved = EBookSection;
        break;
      case this.miniGames:
        resolved = MiniGamesSection;
        break;
      case this.statistics:
        resolved = StatisticsSection;
        break;
      case this.dictionary:
        resolved = DictionarySection;
        break;
      case this.aboutTeam:
        resolved = AboutTeamSection;
        break;
      default:
        resolved = MainSection;
        break;
    }
    return resolved;
  }
}
