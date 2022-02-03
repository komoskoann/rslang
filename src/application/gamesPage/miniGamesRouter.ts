import SprintGameSection from './sprintGameSection';
import AudioCallGameSection from './audioCallGameSection';

export default class MiniGamesRouter {
  resolve(path?: string) {
    let resolved;
    switch (path) {
      case 'sprint':
        resolved = SprintGameSection;
        break;
      case 'audioCall':
        resolved = AudioCallGameSection;
        break;
    }
    return resolved;
  }
}
