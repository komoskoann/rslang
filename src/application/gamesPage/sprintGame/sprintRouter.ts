import SprintGameCard from './sprintGameCard';

export default class SprintRouter {
  resolve(path?: string) {
    let resolved;
    switch (path) {
      case 'start':
        resolved = SprintGameCard;
        break;
    }
    return resolved;
  }
}
