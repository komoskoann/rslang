import Control from '../../controls/control';
import html from './generalStats.html';
import PieChart from './pieChart';
import BarChart from './barChart';
import { IPieData } from './IPieData';
import { IBarData } from './IBarData';

export default class StatisticsCard extends Control {
  private pieChart: PieChart;

  private barChart: BarChart;

  private pieData: IPieData[];

  private barData: IBarData[];

  private correctAnswers: number;

  private totalAnswers: number;

  private newWords: number;

  private secondBarChartParameter: number;

  private barChartClassName: string;

  private pieChartClassName: string;

  constructor(parentNode: HTMLElement, correctAnswers: number, totalAnswers: number, newWords: number, secondBarChartParameter: number, barChartClassName: string, pieChartClassName: string) {
    super(parentNode, 'div', 'statistics-card-wrapper');
    this.correctAnswers = correctAnswers;
    this.totalAnswers = totalAnswers;
    this.newWords = newWords;
    this.secondBarChartParameter = secondBarChartParameter;
    this.barChartClassName = barChartClassName;
    this.pieChartClassName = pieChartClassName;
    this.pieData = [
      { label: 'Правильные ответы', count: this.correctAnswers },
      { label: 'Неправильные ответы', count: this.totalAnswers - this.correctAnswers },
    ];
    this.barData = [
      { name: "Новые слова", value: this.newWords },
      { name: "Самая длинная серия правильных ответов", value: this.secondBarChartParameter }
    ];
  }

  render(): void {
    this.renderBarChartWrapper();
    this.renderPieChartWrapper();
  }

  renderBarChartWrapper(): void {
    const wordsStatsWrapper = new Control(this.node, 'div', this.barChartClassName);
    wordsStatsWrapper.node.innerHTML = html;
    this.barChart = new BarChart();
    this.barChart.createSVG(`.${this.barChartClassName}`, this.barData);
  }

  renderPieChartWrapper(): void {
    const wrapper = new Control(this.node, 'div', this.pieChartClassName);
    new Control(wrapper.node, 'div', 'pie-stats-title', 'Правильные ответы');
    this.pieChart = new PieChart();
    this.pieChart.createSVG(`.${this.pieChartClassName}`, this.pieData);
  }
}
