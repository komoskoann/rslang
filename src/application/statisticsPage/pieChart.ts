import * as d3 from 'd3';
import '../../css/pieChart.css';
import { IPieData } from './IPieData';

export default class PieChart {
  private readonly pieWidth: number = 320;

  private readonly pieHeight: number = 320;

  private readonly pieMargin: number = 30;

  private readonly pieDonutWidth: number = 30;

  private pieRadius: number;

  constructor() {
    this.pieRadius = Math.min(this.pieWidth, this.pieHeight) / 2 - this.pieMargin;
  }

  createSVG(parentElementClassListName: string, dataset: IPieData[]) {
    const svg = d3.select(parentElementClassListName)
      .append("svg")
      .attr("width", this.pieWidth)
      .attr("height", this.pieHeight)
      .append("g")
      .attr("transform", "translate(" + this.pieWidth / 2 + "," + this.pieHeight / 2 + ")");

    const arc = d3.arc<d3.PieArcDatum<IPieData> >()
      .innerRadius(this.pieRadius - this.pieDonutWidth)
      .outerRadius(this.pieRadius);

    const pie = d3.pie<IPieData>()
      .value((d: IPieData) => d.count)
      .sort(null);
    let path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('class', (d, i) => "color" + i);

    const correctAnswersPercent = dataset[0].count / (dataset[0].count + dataset[1].count) * 100;
    const text = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", "5rem");
    text.text(`${Math.floor(correctAnswersPercent)}%`);

  }

}
