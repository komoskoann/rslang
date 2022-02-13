import Control from '../../controls/control';
import html from './generalStats.html';
import PieChart from './pieChart';
import BarChart from './barChart';
import { IPieData } from './IPieData';
import { IBarData } from './IBarData';

export default class GameStatisticsCard extends Control {
  private pieChart: PieChart;

  private barChart: BarChart;

  private correctAnswers: number = 60;

  private totalAnswers: number = 70;

  private pieData: IPieData[] = [
    { label: 'Правильные ответы', count: this.correctAnswers },
    { label: 'Неправильные ответы', count: this.totalAnswers - this.correctAnswers },
  ];

  private barData: IBarData[] = [
    { name: "Новые слова", value: 10 },
    { name: "самая длинная серия правильных ответов", value: 8 }
  ]

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'statistics-card-wrapper');
  }

  render(): void {
    this.renderBarChartWrapper();
    this.renderPieChartWrapper();
  }

  renderBarChartWrapper(): void {
    const wordsStatsWrapper = new Control(this.node, 'div', 'words-stats');
    wordsStatsWrapper.node.innerHTML = html;
    this.barChart = new BarChart();
    this.barChart.createSVG('.words-stats', this.barData);
  }

  renderPieChartWrapper(): void {
    const wrapper = new Control(this.node, 'div', 'pie-stats');
    new Control(wrapper.node, 'div', 'pie-stats-title', 'Правильные ответы');
    this.pieChart = new PieChart();
    this.pieChart.createSVG('.pie-stats', this.pieData);
  }
}
