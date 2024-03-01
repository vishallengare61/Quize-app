import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LoginService } from 'src/Services/login.service';
import { StudentHistoryService } from 'src/Services/student-history.service';
import { TryReportService } from 'src/Services/try-report.service';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-quize-report',
  templateUrl: './quize-report.component.html',
  styleUrls: ['./quize-report.component.css'],
})
export class QuizeReportComponent implements OnInit {
  showGraph: boolean = true;
  correctAnswer: any;
  totalQuestion: any;
  unattempts: any;
  wrongAnswer: any;
  allResultData: any;
  totalTimeSpentForExam: any;
  quiz_pool_name: any;
  quize_date: any;
  resultPrediction: any;
  quizePoolId: any;
  attemptNumber: boolean = false;
  UserResultData: any;
  totalSkipped: any;
  correctAnswers: any;
  quizeAttemptNumber: any;
  attempDropdown: any;
  chart: any;
  chart2: any;
  chart3: any;
  percentage: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _loginService: LoginService,
    private _tryService: TryReportService,
    private _historyService: StudentHistoryService
  ) {}

  ngOnInit(): void {
    this.quizePoolId = this._route.snapshot.paramMap.get('quizeId');
    this.getresultData(this.quizePoolId);
  }

  getresultData(quizeID: any) {
    return new Promise((resolve) => {
      this._historyService.getQuizeResult(quizeID).subscribe((result: any) => {
        this.UserResultData = result.data;
        this.totalQuestion = this.UserResultData.totalQuestions;
        this.correctAnswer = this.UserResultData.correctAnswers;
        this.unattempts = this.UserResultData.unattempts;
        this.wrongAnswer = this.UserResultData.wrongAnswer;
        this.quiz_pool_name = this.UserResultData.quiz_pool_name;
        this.quize_date = this.UserResultData.created_date;
        this.quizeAttemptNumber = this.UserResultData.currentAttemptNo;
        this.attempDropdown = this.UserResultData.allPositions;
        this.totalTimeSpentForExam = this.UserResultData.timeConsumed;
        this.percentage = ((this.correctAnswer / this.totalQuestion) * 100).toFixed(2);
        // console.log( 'getting the percentage of correct answers', this.percentage );
        this.updateGraphData();
        resolve(this.UserResultData);
      });
    });
  }

  data(quizeID: any) {
    // console.log("quizeID--------------------------------selected", quizeID.target.value);
    this.quizePoolId = quizeID.target.value;
    return new Promise((resolve) => {
      this._historyService .getQuizeResult(this.quizePoolId) .subscribe((result: any) => {
          this.UserResultData = result.data;
          this.totalQuestion = this.UserResultData.totalQuestions;
          this.correctAnswer = this.UserResultData.correctAnswers;
          this.unattempts = this.UserResultData.unattempts;
          this.wrongAnswer = this.UserResultData.wrongAnswer;
          this.quiz_pool_name = this.UserResultData.quiz_pool_name;
          this.quize_date = this.UserResultData.created_date;
          // this.quizeAttemptNumber = this.UserResultData.currentAttemptNo;
          this.totalTimeSpentForExam = this.UserResultData.timeConsumed;
          this.percentage = ((this.correctAnswer / this.totalQuestion) * 100).toFixed(2);
          // console.log( 'getting the percentage of correct answers', this.percentage );
          this.updateGraphData();
          resolve(this.UserResultData);
        });
    });
  }

  updateGraphData() {
    this.clearCharts();
    this.appexGraph(this.correctAnswer, this.wrongAnswer);
    this.appexGraph2(this.unattempts, this.totalQuestion);
    this.appexGraph3(this.wrongAnswer, this.totalQuestion);
  }

  clearCharts() {
    const chartElement = document.getElementById('chart');
    const chartElement2 = document.getElementById('chart2');
    const chartElement3 = document.getElementById('chart3');
    
    if (chartElement) {
      const chart = ApexCharts.exec(chartElement?.id, 'destroy');
      if (chart) {
        chart.destroy();
        console.log('clearCharts called for chart');
      }
    }
    
    if (chartElement2) {
      const chart2 = ApexCharts.exec(chartElement2.id, 'destroy');
      if (chart2) {
        chart2.destroy();
        console.log('clearCharts called for chart2');
      }
    }
    
    if (chartElement3) {
      const chart3 = ApexCharts.exec(chartElement3.id, 'destroy');
      if (chart3) {
        chart3.destroy();
        console.log('clearCharts called for chart3');
      }
    }
}


  appexGraph(answered: any, wrong: any) {
    const answeredCount = answered;
    const skippedCount = wrong;
    // Check if chart instance exists
    if (this.chart) {
      // Update series data dynamically
      this.chart.updateSeries([answeredCount, skippedCount]);
    } else {
      const options = {
        chart: {
          height: 350,
          width: 350,
          type: 'donut',
        },
        series: [answeredCount, skippedCount],
        labels: ['Correct', 'Incorrect'],
        dataLabels: {
          enabled: false,
          show: false,
          formatter: function (val: any, opts: any) {
            return opts.w.globals.labels[opts.seriesIndex] + ': ' + val;
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
            },
          },
        },
        colors: ['#1FD115', '#FF1900'],
      };

      this.chart = new ApexCharts(document.querySelector('#chart'), options);
      this.chart.render();
    }
  }
  appexGraph2(skipped: any, total: any) {
    const skippedCount = skipped;
    const answeredCount = total;
    // Check if chart instance exists
    if (this.chart2) {
      // Update series data dynamically
      this.chart2.updateSeries([skippedCount, answeredCount]);
    } else {
      const options = {
        chart: {
          height: 250,
          width: 250,
          type: 'donut',
        },
        series: [skippedCount, answeredCount],
        labels: ['skipped', 'total'],
        dataLabels: {
          enabled: false,
          formatter: function (val: any, opts: any) {
            return opts.w.globals.labels[opts.seriesIndex] + ': ' + val;
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
            },
          },
        },
        colors: ['#ffa500', '#6d7fcc'],
      };

      this.chart2 = new ApexCharts(document.querySelector('#chart2'), options);
      this.chart2.render();
    }
  }
  appexGraph3(incorrect: any, total: any) {
    const answeredCount = incorrect;
    const skippedCount = total;
    // Check if chart instance exists
    if (this.chart3) {
      // Update series data dynamically
      this.chart3.updateSeries([answeredCount, skippedCount]);
    } else {
      const options = {
        chart: {
          height: 250,
          width: 250,
          type: 'donut',
        },
        series: [answeredCount, skippedCount],
        labels: ['incorrect', 'total'],
        dataLabels: {
          enabled: false,
          formatter: function (val: any, opts: any) {
            return opts.w.globals.labels[opts.seriesIndex] + ': ' + val;
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
            },
          },
        },
        colors: ['#FF1900', '#6d7fcc'],
      };

      this.chart3 = new ApexCharts(document.querySelector('#chart3'), options);
      this.chart3.render();
    }
  }

  generatePDF() {
    const reportElement = document.getElementById('disply-container')!;
    setTimeout(() => {
      html2canvas(reportElement, { scale: 2 }).then((canvas) => {
        html2canvas(reportElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('result-Report.pdf');
        });
      });
    }, 800);
  }
}
