import MainSection from '../application/mainPage/mainSection';
import EBookSection from '../application/eBookPage/eBookSection';
import MiniGamesSection from '../application/gamesPage/miniGamesSection';
import StatisticsSection from '../application/statisticsPage/statisticsSection';
import DictionarySection from '../application/dictionaryPage/dictionarySection';
import AboutTeamSection from '../application/aboutTeamPage/aboutTeamSection';

export default class Router {
  private defaultPath = 'main';

  path: string = this.defaultPath;

  resolve(path?: string) {
    this.path = path || this.defaultPath;
    let resolved;
    switch (path) {
      case 'main':
        resolved = MainSection;
        break;
      case 'eBook':
        resolved = EBookSection;
        break;
      case 'miniGames':
        resolved = MiniGamesSection;
        break;
      case 'statistics':
        resolved = StatisticsSection;
        break;
      case 'dictionary':
        resolved = DictionarySection;
        break;
      case 'aboutTeam':
        resolved = AboutTeamSection;
        break;
      default:
        resolved = MainSection;
        break;
    }
    return resolved;
  }
}
