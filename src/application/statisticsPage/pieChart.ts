import * as d3 from 'd3';
import '../../css/pieChart.css';

interface Data {
  label: string;
  count: number;
}

export default class PieChart {
  private readonly pieWidth: number = 300;

  private readonly pieHeight: number = 300;

  private readonly pieMargin: number = 30;

  private readonly pieDonutWidth: number = 30;

  private pieRadius: number;

  private dataset: Data[] = [
          { label: 'Abulia', count: 10 },
          { label: 'Betelgeuse', count: 100 },
        ];

  constructor() {
    this.pieRadius = Math.min(this.pieWidth, this.pieHeight) / 2 - this.pieMargin;
  }

  createSVG(parentElementClassListName: string) {
    const svg = d3.select(parentElementClassListName)
      .append("svg")
      .attr("width", this.pieWidth)
      .attr("height", this.pieHeight)
      .append("g")
      .attr("transform", "translate(" + this.pieWidth / 2 + "," + this.pieHeight / 2 + ")");
    const arc = d3.arc<d3.PieArcDatum<Data> >()
      .innerRadius(this.pieRadius - this.pieDonutWidth)
      .outerRadius(this.pieRadius);
    const pie = d3.pie<Data>()
      .value(function(d: Data) { return d.count; })
      .sort(null);
    let path = svg.selectAll('path')
      .data(pie(this.dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('class', function(d, i) { return "color" + i });

    const text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em");
    text.text(`${this.dataset[0].count}%`);
  }

}
