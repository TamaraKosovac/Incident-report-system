import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnalyticService } from '../../services/analytic.service';
import { FormsModule } from '@angular/forms';

import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables
} from 'ng2-charts';

import { ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,       
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {

  total = 0;
  last24h = 0;
  last7d = 0;
  last30d = 0;

  lat: number = 44.77;
  lng: number = 17.19;
  radius: number = 500;

  topTypesChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  typeDistributionData: ChartData<'pie'> = { labels: [], datasets: [] };
  subtypeChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  dailyChartData: ChartData<'line'> = { labels: [], datasets: [] };
  topLocationsData: ChartData<'bar'> = { labels: [], datasets: [] };

  points: any[] = [];
  radiusCount = 0;

  constructor(private analytic: AnalyticService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.analytic.total().subscribe(v => this.total = v);
    this.analytic.count24h().subscribe(v => this.last24h = v);
    this.analytic.count7d().subscribe(v => this.last7d = v);
    this.analytic.count30d().subscribe(v => this.last30d = v);

    this.analytic.top5Types().subscribe(res => {
      const labels = res.map(x => x.name);
      const data = res.map(x => x.count);

      this.topTypesChartData = {
        labels,
        datasets: [{
          data,
          label: 'Incidents',
          backgroundColor: '#F97316',
          borderColor: '#C2410C',
          borderWidth: 2
        }]
      };
    });

    this.analytic.types().subscribe(res => {
      const labels = res.map(x => x.name);
      const data = res.map(x => x.count);

      this.typeDistributionData = {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#F97316','#FB923C','#FDBA74','#FED7AA','#FFEDD5']
        }]
      };
    });

    this.analytic.subtypes().subscribe(res => {
      const labels = res.map(x => x.name);
      const data = res.map(x => x.count);

      this.subtypeChartData = {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#F97316','#FB923C','#FDBA74','#FED7AA','#FFEDD5']
        }]
      };
    });

    this.analytic.daily().subscribe(res => {
      const labels = res.map(x => x.date);
      const data = res.map(x => x.count);

      this.dailyChartData = {
        labels,
        datasets: [{
          data,
          label: 'Daily count',
          borderColor: '#F97316',
          backgroundColor: 'rgba(249,115,22,0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }]
      };
    });

    this.analytic.topLocations().subscribe(res => {
      const labels = res.map(x => x.address);
      const data = res.map(x => x.count);

      this.topLocationsData = {
        labels,
        datasets: [{
          data,
          label: 'Incidents',
          backgroundColor: '#FB923C',
          borderColor: '#C2410C',
          borderWidth: 2
        }]
      };
    });


    this.analytic.getPoints().subscribe(res => {
      this.points = res;
    });
  }

  checkRadius() {
    this.analytic.countInRadius(this.lat, this.lng, this.radius)
      .subscribe(v => this.radiusCount = v);
  }
}