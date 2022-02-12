import * as d3 from 'd3';
import '../../css/barChart.css';

interface Data {
  name: string;
  value: number;
}

export default class barChart {
  private margin = {top: 30, right: 30, bottom: 70, left: 60};
  private width: number = 300 - this.margin.left - this.margin.right;
  private height: number = 300 - this.margin.top - this.margin.bottom;

  data: Data[] = [
    { name: "Новые слова", value: 7 },
    { name: "Изученные слова", value: 19 }
  ];

  createSVG(parentElementClassListName: string) {
    const svg = d3.select(parentElementClassListName)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    const x = d3.scaleBand()
      .range([ 0, this.width ])
      .domain(this.data.map((d: Data) => d.name))
      .padding(0.2);

    svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("display", "none")
      .style("text-anchor", "end")
      .classed('axis-text', true);

    const y = d3.scaleLinear()
      .domain([0, 50])
      .range([ this.height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll(".my-bar")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", (d: Data) => x(d.name))
      .attr("y", (d: Data) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d: Data) => (this.height - y(d.value)))
      .attr("fill", "#69b3a2");

    svg.selectAll('.numbers')
     .data(this.data)
     .enter()
     .append('text')
     .text((d: Data) => d.value)
     .attr('x', (d, i: number) => (x(d.name) + (x.bandwidth() / 2)))
     .attr('y', (d: Data) => y(d.value) - 10)
     .attr('text-anchor', 'middle')
     .classed('numbers', true);
  }

}
