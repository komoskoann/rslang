import Control from '../../controls/control';

export default class MiniGamesSelectorSection extends Control {
  toSprintButton: Control<HTMLElement>;

  toAudioCallButton: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'select-game-section', 'test select-game');
    this.toSprintButton = new Control(this.node, 'button', 'games-nav-button', 'to Sprint');
    this.toSprintButton.node.id = 'sprint';
    this.toAudioCallButton = new Control(this.node, 'button', 'games-nav-button', 'to AudioCall');
    this.toAudioCallButton.node.id = 'audioCall';
  }
}
