import Control from '../../controls/control';
import '../../css/miniGamesSelector.css';
import html from './miniGamesSection.html';

export default class MiniGamesSelectorSection extends Control {
  toSprintButton: Control<HTMLElement>;

  toAudioCallButton: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'select-game-section');
    this.node.innerHTML = html;
  }
}
