import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/Services/login.service';
import { StudentHistoryService } from 'src/Services/student-history.service';
import * as ApexCharts from 'apexcharts';
@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css'],
})
export class ExamDetailsComponent implements OnInit {
  quizePoolId: any;
  percentValue: any;
  selectedOptionIndex: number = -1;
  questions: any[] = [];
  selectedOptions: number[] = [];
  UserResultData: any[] = [];
  selectedOptionsMap: { [questionId: string]: number } = {};
  currentTime: Date = new Date();
  totalTimeInSeconds: number = 0;
  showLoader: boolean = true;
  questionStartTime: Date | null = null;
  attemptNUmber: any;
  attemptDropdown: any;
  constructor( private _router: Router, private _route: ActivatedRoute, private _loginService: LoginService, private renderer: Renderer2, private _toastr: ToastrService, private _historyService: StudentHistoryService ) {}

  answeredQuestions: {
    questionId: string;
    answer: string;
    selectedOptionId?: any;
    timestamp: number;
    timeTaken: any;
  }[] = [];

  class_id: any;
  quizPoolId: any;
  skippedQuestionsCount: number = 0;
  correctAnswersCount: number = 0;
  incorrectAnswersCount: number = 0;
  totalAnswersCount: any;
  totalSkipped: any;
  totalQuestions: any;
  chart: any;

  ngOnInit(): void {
    this.quizePoolId = this._route.snapshot.paramMap.get('quizeId');
    this.findCurrentQuestion();
    this.getExamDetailsData(this.quizePoolId);
  }

  changeDetails(quizeID: any) {
    const quize__id = quizeID.target.value;
    this._historyService.getQuizeHistory(quize__id).subscribe(
      (apiResponse: any) => {
        this.showLoader = false;
        this.quizPoolId = apiResponse.quizPoolId;
        this.questions = apiResponse.questionDetails || [];
        this.totalAnswersCount = this.questions.filter( (q) => q.selected_answer !== '#' ).length;
        this.totalSkipped = this.questions.filter( (q) => q.selected_answer == '#' ).length;
        this.skippedQuestionsCount = this.questions.filter( (q) => q.selected_answer === '#' ).length;
        this.calculateAnswerStatistics();
        this.appexGraph(this.totalAnswersCount, this.totalSkipped);
        if ( apiResponse.status && apiResponse.questionDetails && Array.isArray(apiResponse.questionDetails) ) {
          this.questions = apiResponse.questionDetails.map(
            (apiQuestion: any) => {
              return {
                id: apiQuestion.id,
                question: apiQuestion.question,
                timeConsumed: apiQuestion.timeConsumed,
                answerkey: apiQuestion.answerkey,
                selected_answer: apiQuestion.selected_answer,
                options: [
                  apiQuestion.optiona,
                  apiQuestion.optionb,
                  apiQuestion.optionc,
                  apiQuestion.optiond,
                ],
              };
            }
          );
        } else {
          console.error('API response is not as expected:', apiResponse);
        }
      },
      (error) => {},
      () => {}
    );
    for (const answeredQuestion of this.answeredQuestions) {
      this.selectedOptionsMap[answeredQuestion.questionId] =
        answeredQuestion.selectedOptionId;
    }
  }

  getExamDetailsData(quizePoolId: any) {
    const getQuizePollID = quizePoolId;
    this._historyService.getQuizeHistory(this.quizePoolId).subscribe( (apiResponse: any) => {
        this.attemptNUmber = apiResponse.currentAttemptNo;
        this.attemptDropdown = apiResponse.allPositions;
        this.showLoader = false;
        this.quizPoolId = apiResponse.quizPoolId;
        this.questions = apiResponse.questionDetails || [];
        this.totalAnswersCount = this.questions.filter( (q) => q.selected_answer !== '#' ).length;
        this.totalSkipped = this.questions.filter( (q) => q.selected_answer == '#' ).length;
        this.skippedQuestionsCount = this.questions.filter( (q) => q.selected_answer === '#' ).length;
        this.calculateAnswerStatistics();
        this.appexGraph(this.totalAnswersCount, this.totalSkipped);
        if ( apiResponse.status && apiResponse.questionDetails && Array.isArray(apiResponse.questionDetails) ) {
          this.questions = apiResponse.questionDetails.map(
            (apiQuestion: any) => {
              return {
                id: apiQuestion.id,
                question: apiQuestion.question,
                timeConsumed: apiQuestion.timeConsumed,
                answerkey: apiQuestion.answerkey,
                selected_answer: apiQuestion.selected_answer,
                options: [
                  apiQuestion.optiona,
                  apiQuestion.optionb,
                  apiQuestion.optionc,
                  apiQuestion.optiond,
                ],
              };
            }
          );
        } else {
          console.error('API response is not as expected:', apiResponse);
        }
      },
      (error) => {},
      () => {}
    );
    for (const answeredQuestion of this.answeredQuestions) {
      this.selectedOptionsMap[answeredQuestion.questionId] =
        answeredQuestion.selectedOptionId;
    }
  }

  clearCharts() {
    const chartElements = document.querySelectorAll('.chart');
    chartElements.forEach((element) => {
      const chart = ApexCharts.exec(element.id, 'destroy');
      if (chart) {
        chart.destroy();
      }
    });
  }

  appexGraph(answered: any, skipped: any) {
    const answeredCount = answered;
    const skippedCount = skipped;
    // Check if chart already exists
    if (this.chart) {
      // Update the series data
      this.chart.updateSeries([answeredCount, skippedCount]);
    } else {
      const options = {
        chart: {
          height: 350,
          width: 350,
          type: 'donut',
        },
        series: [answeredCount, skippedCount],
        labels: ['Answered', 'Skipped'],
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
        colors: ['#1FD115', '#c1c1c1'],
      };
      this.chart = new ApexCharts(document.querySelector('#chart'), options);
      this.chart.render();
    }
  }

  calculateAnswerStatistics() {
    this.answeredQuestions.forEach((question: any) => {
      const correctAnswer = question.answerkey.toLowerCase().trim();
      const selectedAnswer = question.selected_answer.toLowerCase().trim();
      if (correctAnswer === selectedAnswer) {
        this.correctAnswersCount++;
      } else {
        this.incorrectAnswersCount++;
      }
    });
  }

  isCorrect(questionIndex: any) {
    return ( this.questions[questionIndex].answerkey === this.questions[questionIndex].selected_answer );
  }
  isInCorrect(questionIndex: any) {
    return ( this.questions[questionIndex].answerkey !== this.questions[questionIndex].selected_answer );
  }

  isSkipped(questionIndex: any) {
    return ( this.questions[questionIndex].selected_answer === '#' && this.questions[questionIndex].answerkey !==
        this.questions[questionIndex].selected_answer );
  }
  timeSkipped(questionIndex: number) {
    const question = this.questions[questionIndex];
    return ( this.questions[questionIndex].selected_answer === '#' && this.questions[questionIndex].answerkey !==
        this.questions[questionIndex].selected_answer );
  }

  isQuestionAnswered(questionIndex: number): boolean {
    return this.answeredQuestions.some( (answer) => answer.questionId === this.questions[questionIndex].id );
  }
  currentQuestion = 0;
  notAttemptedQuestions: any;
  answeredQuestionValues: any;
  visitedNotAnsweredQuestions: any;

  findCurrentQuestion() {
    this.questionStartTime = new Date();
    const currentQuestion = this.currentQuestion;
    const question = this.questions[currentQuestion];
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
    const currentQuestionId = this.questions[this.currentQuestion].id;
    const attemptedAnswer = this.answeredQuestions.find( (q) => q.questionId === currentQuestionId );
    if (attemptedAnswer) {
    } else {
    }
    this.findCurrentQuestion();
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  jumpToQuestion(questionIndex: any) {
    this.currentQuestion = questionIndex;
  }

  getOptionLetter(index: number | undefined): string {
    const optionLetters = ['a', 'b', 'c', 'd'];
    return index !== undefined ? optionLetters[index] : '';
  }

  isCorrectAnswer(optionIndex: number): boolean {
    return ( this.questions[this.currentQuestion].answerkey === String.fromCharCode(97 + optionIndex) );
  }

  getSelectedAnswer(): string {
    return this.questions[this.currentQuestion].selected_answer;
  }
  indexToLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }
}
