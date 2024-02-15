import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LoginService } from 'src/Services/login.service';
import { StudentHistoryService } from 'src/Services/student-history.service';
import { TryReportService } from 'src/Services/try-report.service';

@Component({
  selector: 'app-quize-report',
  templateUrl: './quize-report.component.html',
  styleUrls: ['./quize-report.component.css'],
})
export class QuizeReportComponent implements OnInit  {

  showGraph: boolean = true;
  hasSubjective: boolean = false;
  highcharts = Highcharts;
  excellent: any;
  average: any;
  poor: any;
  skippedPerc: any;
  incorrectPerc: any;
  correctPerc: any;
  chartOptions = {};
  chartOptionsa = {};
  chartOptionsb = {};
  chartOptionsc = {};
  UserScore:any;
  skippedScore:any;
  wrongScore:any;
  percentValue:any;
  correctAnswer:any ;
  totalMarks:any ;
  totalQuestion:any ;
  unattempts:any;
  wrongAnswer:any ;
  allResultData:any;
  totalTimeSpentForExam: any;
  quiz_pool_name:any;
  quize_date: any;
  resultPrediction: any;
  quizePoolId: any;
  constructor(private _router: Router, private _route : ActivatedRoute, private _loginService:LoginService, private _tryService: TryReportService, private _historyService: StudentHistoryService){

  }
  ngOnInit(): void {
    this.quizePoolId = this._route.snapshot.paramMap.get('quizeId');  
    
//     this._historyService.getQuizeResult(this.quizePoolId).subscribe((result: any) => {
//           this.allResultData = result.data;
//           console.log('getting the API response',this.allResultData);
          
  
// });

    // this.totalTimeSpentForExam = localStorage.getItem('totalTimeSpentForExam');
    this.allResultData = localStorage.getItem('result');
    console.log('getting the localstorage data', this.allResultData);
    
    if (this.allResultData!=null) {
      const paresedData = JSON.parse(this.allResultData);
      this.correctAnswer = paresedData.correctAnswers;
      this.totalMarks = paresedData.totalMarks;
      this.totalQuestion = paresedData.totalQuestions;
      this.unattempts = paresedData.unattempts;
      this.wrongAnswer = paresedData.wrongAnswer;
      this.totalTimeSpentForExam = paresedData.timeConsumed;
      this.quiz_pool_name = paresedData.quiz_pool_name;
      this.quize_date = paresedData.created_date;
    }
    // Set correct values for the charts
    this.UserScore = this.correctAnswer; 
    this.skippedScore = this.unattempts; 
    this.wrongScore = this.wrongAnswer; 
    this.percentValue = (this.correctAnswer / this.totalQuestion) * 100;
    this.skippedPerc = ( this.unattempts / this.totalQuestion ) * 100;
    this.incorrectPerc = (this.wrongAnswer / this.totalQuestion) * 100;
    this.initGraph();
    // this.initGrapha();
    this.initGraphb();
    this.initGraphc();
    this.resultPrediction = this.percentValue.toFixed( 2 );

    // this.highchartsInitialize();
}


// highchartsInitialize() {
//   this._historyService.getQuizeResult(this.quizePoolId).subscribe((result: any) => {
//     this.allResultData = result.data;

//     if (this.allResultData) {
//       this.correctAnswer = this.allResultData.correctAnswers;
//       this.totalMarks = this.allResultData.totalMarks;
//       this.totalQuestion = this.allResultData.totalQuestions;
//       this.unattempts = this.allResultData.unattempts;
//       this.wrongAnswer = this.allResultData.wrongAnswer;
//       this.totalTimeSpentForExam = this.allResultData.timeConsumed;
//     }

//     this.UserScore = this.correctAnswer;
//     this.skippedScore = this.unattempts;
//     this.wrongScore = this.wrongAnswer;
//     this.percentValue = (this.correctAnswer / this.totalQuestion) * 100;
//     this.skippedPerc = (this.unattempts / this.totalQuestion) * 100;
//     this.incorrectPerc = (this.wrongAnswer / this.totalQuestion) * 100;

//     this.graphInitilize(); // Move chart initialization here
//   });
// }

// graphInitilize(){
//   this.initGraph();
//   this.initGraphb();
//   this.initGraphc();
//   this.resultPrediction = this.percentValue.toFixed( 2 );
// }
initGraph() {
  this.chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: '#F5F4F4'
    },
    credits: {
      enabled: false
    },
    tooltip: { enabled: false },
    title: {
      text: `${this.percentValue.toFixed(2)}%`, 
      verticalAlign: 'middle',
      floating: true
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        }
      }
    },
    colors: [
      this.UserScore > 0 ? '#1FD115' : '#808080',
      this.UserScore < this.totalQuestion ? '#FF1900' : '#808080'
    ],
    series: [{
      innerSize: '80%',
      data: [{
        name: `Correct`,
        y: this.UserScore
      },
      {
        name: `InCorrect`,
        y: this.totalQuestion - this.UserScore
      }]
    }],
  };
}

initGraphb() {
  this.chartOptionsb = {   
    chart: {
      height: 150,
      width: 150,
      type: 'pie',
      backgroundColor: '#FFFFFF'
    },
    credits: {
      enabled: false
    },
    tooltip: { enabled: false },
    title: {
      text: `${this.skippedPerc.toFixed(2)}%`,
      verticalAlign: 'middle',
      floating: true
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        }
      }
    },
    colors: [
      this.skippedScore > 0 ? '#9460ff' : '#808080', 
      this.skippedScore < this.totalQuestion ? '#e7eaeb' : '#808080'
    ],
    series: [{
      innerSize: '80%',
      data: [{
        name: `Correct`,
        y: this.skippedScore
      },
      {
        name: `InCorrect`,
        y: this.totalQuestion - this.skippedScore
      }]
    }],
  };
}
initGraphc() {
this.chartOptionsc = {   
   chart: {
    height: 150,
    width: 150,
      type: 'pie',
      backgroundColor : '#FFFFFF'
   },
   credits: {
    enabled: false
  },
  tooltip: { enabled: false },
   title: {
    text: `${this.incorrectPerc.toFixed(2)}%`,
    verticalAlign: 'middle',
    floating: true
   },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
          dataLabels: {
              enabled: false,
          }
    }
  },
  colors: [
    this.wrongScore > 0 ? '#ffa500' : '#808080', 
    this.wrongScore < this.totalQuestion ? '#e7eaeb' : '#808080'
],
series: [{
  innerSize: '80%',
  data: [{
    name: `Correct`,
    y: this.wrongScore
  },
  {
    name: `InCorrect`,
    y: this.totalQuestion - this.wrongScore
  }]
}],

};
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
