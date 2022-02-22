import * as d3 from 'd3';
import '../../css/barChart.css';
import { IBarData } from './IBarData';

export default class BarChart {
  private margin = { top: 30, right: 30, bottom: 70, left: 60 };

  private width: number = 320 - this.margin.left - this.margin.right;

  private height: number = 320 - this.margin.top - this.margin.bottom;

  createSVG(parentElementClassListName: string, data: IBarData[]): void {
    const svg = d3
      .select(parentElementClassListName)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d: IBarData) => d.name))
      .padding(0.2);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('display', 'none')
      .style('text-anchor', 'end')
      .classed('axis-text', true);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max([data[0].value, data[1].value]) * 1.1])
      .range([this.height, 0]);

    svg.append('g').call(d3.axisLeft(y));

    svg
      .selectAll('.my-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: IBarData) => x(d.name))
      .attr('y', (d: IBarData) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: IBarData) => this.height - y(d.value))
      .attr('class', function (d, i) {
        return 'color' + i;
      });

    svg
      .selectAll('.numbers')
      .data(data)
      .enter()
      .append('text')
      .text((d: IBarData) => d.value)
      .attr('x', (d: IBarData) => x(d.name) + x.bandwidth() / 2)
      .attr('y', (d: IBarData) => y(d.value) - 10)
      .attr('text-anchor', 'middle')
      .classed('numbers', true);
  }
}
