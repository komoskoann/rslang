import Control from '../../controls/control';
import html from './statistics.html';
import '../../css/statistics.css';
import GeneralStatisticsCard from './generalStatisticsCard';

export default class StatisticsSection extends Control {
  generalStatisticsCard: GeneralStatisticsCard;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'statistics-section');
    const pageTitleWrapper = new Control(this.node, 'div', 'book-text');
    new Control(pageTitleWrapper.node, 'h2', '', 'Статистика');
    new Control(pageTitleWrapper.node, 'h5', '', 'Ваша статистика за сегодня');
    const statisticsWrapper = new Control(this.node, 'div', 'statistics-wrapper');
    statisticsWrapper.node.innerHTML = html;
    this.renderGeneralStatsWrapper();
  }

  renderGeneralStatsWrapper() {
    // console.log(this.node.querySelector('#general-stats').append())
    const generalStatsWrapper = this.node.querySelector('#general-stats') as HTMLElement;
    new GeneralStatisticsCard(generalStatsWrapper).render();
    

  }
}
