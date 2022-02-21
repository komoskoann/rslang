import audioChallengeResultsPageHTML from './audioChallengeResultsPage.html';
import Control from '../../../controls/control';
import { RoundResult } from './audioChallengeGamePage';

export default class AudioChallengeResultsPage extends Control {
  private audio: HTMLAudioElement;

  private serverURL = 'https://rslangapplication.herokuapp.com/';

  isPlaying = false;

  results: RoundResult[] = [];

  tableResults: HTMLTableSectionElement;

  constructor(parentNode: HTMLElement, results: RoundResult[]) {
    super(parentNode.parentElement, 'div', 'audio-challenge-container', '');
    this.node.innerHTML = audioChallengeResultsPageHTML;
    this.results = results;
    this.renderResultsTable(this.results);
    this.renderResultsTitle(this.results);
  }

  private renderResultsTitle(results: RoundResult[]): void {
    const textNode = this.node.querySelector('.audio-challenge__results-title') as HTMLElement;
    let confirmAnswers = 0;
    let message = '';
    for (let i = 0; i < results.length; i++) {
      if (results[i][1]) {
        ++confirmAnswers;
      }
    }
    if (confirmAnswers < 3) {
      message = 'Снизу скоро постучат.';
    } else if (confirmAnswers < 6) {
      message = 'Неплохо-неплохо. Попробуй еще разок.';
    } else if (confirmAnswers < 8) {
      message = 'Ты можешь ещё лучше, я уверен.';
    } else if (confirmAnswers < 10) {
      message = 'А ты хорош.';
    } else message = 'Ты великолепен.';
    textNode.textContent = message;
  }

  private renderResultsTable(results: RoundResult[]): void {
    if (results.length) {
      this.tableResults = document.getElementById('tableResultsBody') as HTMLTableSectionElement;
      for (let i = 0; i < this.results.length; i++) {
        const row = this.tableResults.insertRow();
        const rowNumberCell = row.insertCell();
        const rowWordCell = row.insertCell();
        const rowTranscriptionCell = row.insertCell();
        const rowTranslateCell = row.insertCell();
        const rowResultCell = row.insertCell();
        const rowButtonSoundCell = row.insertCell();
        row.classList.add('table-row');
        rowButtonSoundCell.className = 'audio-challenge__col-button-sound';
        rowNumberCell.className = 'cell-center audio-challenge__col1-point';
        rowWordCell.className = 'cell-center audio-challenge__col2-word';
        rowTranscriptionCell.className = 'cell-center audio-challenge__col3-transcription';
        rowTranslateCell.className = 'cell-center audio-challenge__col4-translate';
        rowResultCell.className = 'cell-center audio-challenge__col5-result';
        const buttonSound = document.createElement('button');
        const resultIcon = document.createElement('div');
        buttonSound.className = 'table-button table-button__sound';
        rowWordCell.textContent = results[i][0].word.slice(0, 1).toUpperCase() + results[i][0].word.slice(1);
        rowTranscriptionCell.textContent = results[i][0].transcription;
        rowTranslateCell.textContent =
          results[i][0].wordTranslate.slice(0, 1).toUpperCase() + results[i][0].wordTranslate.slice(1);
        rowNumberCell.textContent = String(i + 1);
        rowButtonSoundCell.appendChild(buttonSound);
        rowResultCell.appendChild(resultIcon);
        if (results[i][1]) {
          resultIcon.className = 'audio-challenge__col5-result_icon confirm';
        } else {
          resultIcon.className = 'audio-challenge__col5-result_icon wrong';
        }
      }
      this.node.addEventListener('click', this.playSoundWord);
    }
  }

  private playSoundWord = (): void => {
    const target = (event.target as Element).closest('.table-button__sound') as HTMLButtonElement;
    if (target) {
      const index = +target.closest('.table-row').querySelector('.audio-challenge__col1-point').innerHTML - 1;
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      }
      this.playAudio(index);
    }
  };

  private playAudio = (index: number): void => {
    if (!this.isPlaying || this.audio?.ended) {
      this.audio = new Audio();
      this.audio.volume = 0.05;
      this.audio.src = `${this.serverURL}${this.results[index][0].audio}`;
      this.audio.play();
      this.isPlaying = true;
    } else if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  };
}
