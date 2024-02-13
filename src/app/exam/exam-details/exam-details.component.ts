import { Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/Services/login.service';
import { StudentHistoryService } from 'src/Services/student-history.service';
import { TryReportService } from 'src/Services/try-report.service';

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {

  quizePoolId:any;

  selectedOptionIndex: number = -1;
  questions: any[] = [];
  selectedOptions: number[] = [];
  UserResultData: any[] = [];
  selectedOptionsMap: { [questionId: string]: number } = {};
  currentTime: Date = new Date();
  totalTimeInSeconds: number = 0;
  showLoader: boolean = true;
  questionStartTime: Date | null = null;


  constructor(private _router: Router, private _route : ActivatedRoute, private _loginService:LoginService, private renderer: Renderer2,private _toastr: ToastrService, private _historyService: StudentHistoryService){}

  answeredQuestions: {
    questionId: string;
    answer: string;
    selectedOptionId?: any;
    timestamp: number;
    timeTaken: any
  }[] = [];

  class_id: any;
   quizPoolId: any;

   skippedQuestionsCount: number = 0;
   correctAnswersCount: number = 0;
   incorrectAnswersCount: number = 0;
   totalAnswersCount:any;
   totalSkipped: any;

  ngOnInit(): void {
    this.quizePoolId = this._route.snapshot.paramMap.get('quizeId');

    this.findCurrentQuestion();

    this._historyService.getQuizeHistory(this.quizePoolId).subscribe( (apiResponse: any) => {
      this.showLoader = false;
      this.quizPoolId = apiResponse.quizPoolId;
      
      console.log('getting the quizPoolId ------------', apiResponse);
      this.questions = apiResponse.questionDetails || [];
      this.totalAnswersCount = this.questions.filter(q => q.selected_answer !== "#").length;
      this.totalSkipped = this.questions.filter(q => q.selected_answer == "#").length;
      this.skippedQuestionsCount = this.questions.filter(q => q.selected_answer === "#").length;
      this.calculateAnswerStatistics();


      if (apiResponse.status && apiResponse.questionDetails && Array.isArray(apiResponse.questionDetails)) {
        this.questions = apiResponse.questionDetails.map((apiQuestion: any) => {
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
        });
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

  calculateAnswerStatistics() {
    this.answeredQuestions.forEach((question:any) => {
      const correctAnswer = question.answerkey.toLowerCase().trim();
      const selectedAnswer = question.selected_answer.toLowerCase().trim();
      if (correctAnswer === selectedAnswer) {
        this.correctAnswersCount++;
      } else {
        this.incorrectAnswersCount++;
      }
    });
  }
  isQuestionAnswered(questionIndex: number): boolean {
    return this.answeredQuestions.some(
      (answer) => answer.questionId === this.questions[questionIndex].id
    );
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
    const attemptedAnswer = this.answeredQuestions.find(
      (q) => q.questionId === currentQuestionId
    );
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
    const currentQuestion = this.questions[this.currentQuestion];
    if (currentQuestion.selected_answer === "#") {
      return false; // Return false if the question is skipped
    }
    return currentQuestion.answerkey === String.fromCharCode(97 + optionIndex);
  }
  
  isQuestionSkipped(): boolean {
    return this.questions[this.currentQuestion].selected_answer === "#";
  }
  
  
  getSelectedAnswer(): string {
    return this.questions[this.currentQuestion].selected_answer;
  }

  indexToLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }
  
}
