import Control from '../../controls/control';
import '../../css/miniGamesSelector.css';
import html from './miniGamesSection.html';

export default class MiniGamesSelectorSection extends Control {
  private text: string;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'select-game-section');
    const pageTitleWrapper = new Control(this.node, 'div', 'book-text');
    new Control(pageTitleWrapper.node, 'h2', '', 'Мини-игры');
    new Control(pageTitleWrapper.node, 'h5', '', this.changeText());
    const gameButtonsWrapper = new Control(this.node, 'div', 'game-buttons-wrapper');
    gameButtonsWrapper.node.innerHTML = html;
  }

  private changeText(): string {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user) {
      this.text = 'Выберите игру';
    } else {
      const userName = user.name.split(' ')[0];
      this.text = `Выбери игру, ${userName}!`
    }
    return this.text;
  }
}
