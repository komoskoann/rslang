import MainSection from '../application/mainPage/mainSection';
import EBookSection from '../application/eBookPage/eBookSection';
import MiniGamesSection from '../application/gamesPage/miniGamesSection';
import StatisticsSection from '../application/statisticsPage/statisticsSection';
import AboutTeamSection from '../application/aboutTeamPage/aboutTeamSection';
import SprintGameSection from './gamesPage/sprintGame/sprintGameSection';
import AudioSection from '../application/gamesPage/audioCallGameSection';
import SprintGameCard from './gamesPage/sprintGame/sprintGameCard';

export default class Router {
  private defaultPath = 'main';

  path: string = this.defaultPath;

  private main: string = 'main';

  private eBook: string = 'eBook';

  private miniGames: string = 'miniGames';

  private statistics: string = 'statistics';

  private aboutTeam: string = 'aboutTeam';

  private hardWords: string = 'hardWords';

  private sprintGame: string = 'sprint';

  private sprintGameStart: string = 'sprintStart';

  private audioGame: string = 'audio';

  resolve(path?: string) {
    this.path = path || location.hash.split('/')?.pop() || this.defaultPath;
    let resolved;
    switch (this.path) {
      case this.main:
        resolved = MainSection;
        break;
      case this.hardWords:
        localStorage.setItem('isHard', 'true');
        resolved = EBookSection;
        break;
      case this.sprintGame:
        resolved = SprintGameSection;
        break;
        case this.sprintGameStart:
          resolved = SprintGameCard;
          break;  
      case this.audioGame:
        resolved = AudioSection;
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
