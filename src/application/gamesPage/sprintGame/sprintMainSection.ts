import Control from '../../../controls/control';
import '../../../css/sprintGame.css';
import sprintSection from './sprintGameSection.html';
import GetWordsToSprint from '../../services/sprintGame/getWordsToSprint';
import LocalStorage from '../../services/words/localStorage';

export default class MainSprintSection extends Control {
  service: GetWordsToSprint = new GetWordsToSprint();

  private currentEnglishLevel: number;

  englishLevel: string = 'EngLevel';

  localStorage: LocalStorage = new LocalStorage();

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'select-main-section');
    this.node.innerHTML = sprintSection;
    this.currentEnglishLevel = +this.localStorage.getFromLocalStorage(this.englishLevel);
    this.navLevels();
  }

  private navLevels(): void {
    this.node.querySelectorAll('[level]').forEach((level) => {
      level.addEventListener(
        'click',
        function (instance: MainSprintSection) {
          (instance.node.querySelector('.start-button') as HTMLButtonElement).disabled = false;
          instance.currentEnglishLevel = +level.getAttribute('level');
          instance.node.querySelector('[level]').classList.add('levelGame');
          instance.localStorage.setToLocalStorage(instance.englishLevel, `${instance.currentEnglishLevel}`);
        }.bind(null, this),
      );
    });
  }

  destroy() {
    super.destroy();
  }
}
