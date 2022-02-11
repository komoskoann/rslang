import Control from '../../controls/control';
import html from './generalStats.html';

export default class GeneralStatisticsCard extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'statistics-card-wrapper');
  }

  render() {
    this.renderWordsStatsWrapper(1, 1);
    this.renderPieChartWrapper();
  }

  renderWordsStatsWrapper(newWords: number, learntWords: number) {
    const wordsStatsWrapper = new Control(this.node, 'div', 'words-stats');
    wordsStatsWrapper.node.innerHTML = html;
    this.node.querySelector('.new-words-amount').textContent = `${newWords}`;
    this.node.querySelector('.learnt-words-amount').textContent = `${learntWords}`;
  }

  renderPieChartWrapper() {
    const pieStatsWrapper = new Control(this.node, 'div', 'pie-stats');
    pieStatsWrapper.node.innerHTML = 'ytdfyguhijh';
  }
}
