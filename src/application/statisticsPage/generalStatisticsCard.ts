import Control from '../../controls/control';
import html from './generalStats.html';

export default class GeneralStatisticsCard extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'statistics-card-wrapper');
  }

  render() {
    this.renderWordsStatsWrapper();
    this.renderPieChartWrapper();
  }

  renderWordsStatsWrapper() {
    const wordsStatsWrapper = new Control(this.node, 'div', 'words-stats');
    wordsStatsWrapper.node.innerHTML = html;
  }

  renderPieChartWrapper() {
    const wrapper = new Control(this.node, 'div', 'pie-stats');
    new Control(wrapper.node, 'div', 'pie-stats-title', 'Правильных ответов за день');
  }
}
