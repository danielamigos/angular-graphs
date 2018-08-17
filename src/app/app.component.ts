import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  public data: { links: Array<any>, nodes: Array<any> };

  private margin: any = { top: 20, bottom: 20, left: 50, right: 50 };
  private chart: any;
  private width: number;
  private height: number;

  private wrapper: any;
  private svg: any;
  private radius = 10;

  private simulation: any;
  private link: any;
  private node: any;

  title = 'app';


  ngOnInit() {
    this.data = { nodes: [], links: [] };
    this.data.nodes = [];
    this.data.nodes.push({ id: '1', size: 10, color: '#0099ff' });
    this.data.nodes.push({ id: '2', size: 20, color: '#ff0099' });
    this.data.nodes.push({ id: '3', size: 30, color: '#99ff00' });
    this.data.nodes.push({ id: '4', size: 40, color: '#ff9900' });
    this.data.links.push({ source: '1', target: '2' });
    this.data.links.push({ source: '1', target: '3' });
    this.data.links.push({ source: '1', target: '4' });
    this.createChart();
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.wrapper = d3.select(element).append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    const zoom_handler = d3.zoom()
      .on('zoom', () => {
        this.svg.attr('transform', d3.event.transform);
      });

    this.wrapper.call(zoom_handler);

    this.svg = this.wrapper.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');


    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(function (d) { return d.id; }).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    this.link = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.data.links)
      .enter().append('line')
      .attr('stroke-width', function (d) { return 2; });

    this.node = this.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.data.nodes)
      .enter().append('circle')
      .attr('r', (d) => d.size)
      .attr('fill', (d) => d.color)
      .call(d3.drag()
        .on('start', (d) => {
          this.dragstarted(d);
        })
        .on('drag', (d) => {
          this.dragged(d);
        })
        .on('end', (d) => {
          this.dragended(d);
        })
      );


    this.simulation
      .nodes(this.data.nodes)
      .on('tick', () => {
        this.ticked();
      });

    this.simulation.force('link')
      .links(this.data.links);

  }
  ticked() {
    this.link
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });

    this.node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }
  dragstarted(d) {    
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;

  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;

  }
}
