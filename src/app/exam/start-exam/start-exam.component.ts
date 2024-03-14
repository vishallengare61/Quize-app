import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/Services/login.service';
import { TryReportService } from 'src/Services/try-report.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SideBarService } from 'src/Services/side-bar.service';
import { Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css'],
})
export class StartExamComponent implements OnInit, OnDestroy  {
  selectedOptionIndex: number = -1;
  questions: any[] = [];
  selectedOptions: number[] = [];
  questionTexts: any;
  UserResultData: any[] = [];
  selectedOptionsMap: { [questionId: string]: number } = {};
  currentTime: Date = new Date();
  totalTimeInSeconds: number = 0;
  private timerInterval: any;
  showLoader: boolean = true;
  questionStartTime: Date | null = null;
  
  navigationAttemptCount: number = 0;

  constructor( private renderer: Renderer2, private _router: Router, private _tryReportService: TryReportService, private _loginService: LoginService, private _route: ActivatedRoute, private _toastr: ToastrService, private sanitizer: DomSanitizer, private _sideBar: SideBarService ) {}

  testObj: any;
  subjectName: any;
  chapter_id: any;

  answeredQuestions: {
    questionId: string;
    answer: string;
    selectedOptionId?: any;
    timestamp: number;
    timeTaken: any
  }[] = [];

  setIntervalRef: any;
  localStorageClassID:any;
  class_id: any;
  part_id: any;
  q_count: any;
   start_time: any;
   end_time: any;
   quizPoolId: any;
   diff_level: any;

   isExamInProgress: boolean = true;

   videoRef: any;
   stream: MediaStream | undefined;
   isOnExamScreen: boolean = false;

   triggerObservable: Subject<void> = new Subject<void>();

   
  ngOnInit() {
    this.isOnExamScreen = true;
    this._sideBar.setSidebarOpen(false);
    this._sideBar.setExamStarted(true);
    this.disableBrowserBackButton();
    this.videoRef = document.getElementById('video');
    // this.setUpCamera();
    this.startCapture();
    this.start_time = Math.floor(Date.now() / 1000);
    const localStorageUser = localStorage.getItem('user');
    this.part_id = localStorage.getItem('parts_id');
    if (localStorageUser !== null) {
      this.localStorageClassID = JSON.parse(localStorageUser);
      this.class_id = this.localStorageClassID.user.class_id[0];
    }
    this.findCurrentQuestion();
    this.findAnsweredQuestions();
    this.findNotAttemptedQuestions();
    this.findAnsweredQuestionValues();
    this.findVisitedNotAnsweredQuestions();
    this.subjectName = this._route.snapshot.paramMap.get('s_name');
    this.chapter_id = this._route.snapshot.paramMap.get('chapter_id');
    this.q_count = this._route.snapshot.paramMap.get('q_count');
    this.diff_level = this._route.snapshot.paramMap.get('diff_level');
 
   this.startExam();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url !== '/start-exam') {
          this._sideBar.setSidebarOpen(true);
        }
      }
    });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleImage(image: WebcamImage) {
    // Handle captured image data here
  }

  startCapture() {
    this.triggerObservable.next();
  }

  startExam(){
    // this.detectScreenSharing();
    if (this.chapter_id === 'chapterMixTest') {
      this.partsMixTest();
    }else if(this.chapter_id === 'SubjectMixTest'){
      this.subjectMixTest();
    }else{
      this.regularChapterTest();
    }
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = undefined;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  } 

  handleVisibilityChange = () => {
    this.navigationAttemptCount++;

    if (document.hidden && this.isOnExamScreen) {
      // Show alert to the user
      // alert('Please close all other tabs/windows before starting the exam.');
    }

    if (document.hidden) {
      // this._toastr.warning('You Have try to switch the tab while attendnig the exam, your test will submit atomatically, thanks!');
      // window.alert(`you have tried to switch the tab while attendnig the exam, plz dont swith the tab ! IF you switch the tab 3 times then exam will submit atomatically!
      // current warnig- ${this.navigationAttemptCount -1}`)
    }
    if (this.navigationAttemptCount === 1) {
      window.alert('You Have try to switch the tab while attendnig the exam, your test will submit atomatically, thanks!');
      this.completeTest();
    }
  };

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = 'Are you sure you want to leave the exam?'; 
    return event.returnValue;
  }


  async detectScreenSharing() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      // If the user is able to get display media, it indicates screen sharing.
      this.handleScreenSharingDetected();
    } catch (error) {
      // If the user is unable to get display media, screen sharing is likely disabled or not supported.
      this.handleScreenSharingNotDetected();
    }
}

handleScreenSharingDetected() {
  alert('You are currently sharing your screen. Please stop screen sharing before starting the exam.');
  // Or show a modal dialog to inform the user to stop screen sharing.
}

  handleScreenSharingNotDetected(){
    alert('you are good to go. best of luck!')
  }

  // setUpCamera() {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     navigator.mediaDevices.getUserMedia({
  //       video: { width: 100, height: 100 },
  //       audio: false
  //     }).then(stream => {
  //       this.stream = stream;
  //       this.videoRef.srcObject = stream;
  //     }).catch(error => {
  //       console.error('Error accessing camera:', error);
  //     });
  //   } else {
  //     console.error('getUserMedia is not supported in this browser.');
  //   }
  // }
  

  disableBrowserBackButton() {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
    };
  }

  regularChapterTest(){
    this._loginService.getQuestions(this.subjectName, this.chapter_id, this.class_id) .subscribe( (apiResponse: any) => {
      this.showLoader = false;
      this.quizPoolId = apiResponse.quizPoolId;
      if ( apiResponse.status && apiResponse.all_question && Array.isArray(apiResponse.all_question) ) {
        this.questions = apiResponse.all_question.map(
          (apiQuestion: any) => {
            return { id: apiQuestion.id, question: apiQuestion.question,
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
        // console.error('API response is not as expected:', apiResponse);
      }
    },
    (error) => {},
    () => {}
  );

for (const answeredQuestion of this.answeredQuestions) {
  this.selectedOptionsMap[answeredQuestion.questionId] =
    answeredQuestion.selectedOptionId;
}
this.calculateRemainingTime();
 }

 partsMixTest(){
  const modal = {part_id: parseInt(this.part_id), no_of_question: parseInt(this.q_count)};
  this._loginService.getMixQuestions(modal).subscribe( (apiResponse: any) => {
    this.showLoader = false;
    this.quizPoolId = apiResponse.quizPoolId;
    if (apiResponse.all_question && Array.isArray(apiResponse.all_question) ) {
      this.questions = apiResponse.all_question.map(
        (apiQuestion: any) => {
          return { id: apiQuestion.id, question: apiQuestion.question,
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
      // console.error('API response is not as expected:', apiResponse);
    }
  },
  (error) => {},
  () => {}
);

for (const answeredQuestion of this.answeredQuestions) {
this.selectedOptionsMap[answeredQuestion.questionId] =
  answeredQuestion.selectedOptionId;
}
this.calculateRemainingTime();
 }

 subjectMixTest(){  
  const modal = {subject_id: parseInt(this.subjectName), no_of_question: parseInt(this.q_count)};
  this._loginService.getMixQuestions(modal).subscribe( (apiResponse: any) => {
    this.showLoader = false;
    this.quizPoolId = apiResponse.quizPoolId;
    if (apiResponse.all_question && Array.isArray(apiResponse.all_question) ) {
      this.questions = apiResponse.all_question.map(
        (apiQuestion: any) => {
          return { id: apiQuestion.id, question: apiQuestion.question,
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
      // console.error('API response is not as expected:', apiResponse);
    }
  },
  (error) => {},
  () => {}
);

for (const answeredQuestion of this.answeredQuestions) {
this.selectedOptionsMap[answeredQuestion.questionId] =
  answeredQuestion.selectedOptionId;
}
this.calculateRemainingTime();
 }

  calculateRemainingTime(): void {
    this.setIntervalRef = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    if (this.totalTimeInSeconds < 60 * 60) {
      this.totalTimeInSeconds += 1;
      if (this.totalTimeInSeconds === 30 * 60) {
        this._toastr.warning(
          'WARNING! , You have complete 30 minutes, hurry up!'
        );
      }
      if (this.totalTimeInSeconds === 50 * 60) {
        this._toastr.error(
          'hurry up , 50 min done!, EXAM WILL AUTO-SUBMIT AFTER TIME END'
        );
      }
    } else {
      if (this.setIntervalRef) {
        clearInterval(this.setIntervalRef);
        this.completeTest();
      }
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  pad(val: number): string {
    return val < 10 ? `0${val}` : `${val}`;
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
  
  findAnsweredQuestions() {
    const answeredQuestions = this.answeredQuestions.map((answer) => {
      const question = this.questions.find(
        (q: any) => q.id === answer.questionId
      );
      return { ...answer, question };
    });
  }

  findAnsweredQuestionValues() {
    this.answeredQuestionValues = this.answeredQuestions.map((answer) => {
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.answer,
        selectedOptionId: answer.selectedOptionId,
      };
    });
  }

  findNotAttemptedQuestions() {
    this.notAttemptedQuestions = this.questions.filter((question: any) => {
      return !this.answeredQuestions.some(
        (answer) => answer.questionId === question.id
      );
    });
  }

  findVisitedNotAnsweredQuestions() {
    this.visitedNotAnsweredQuestions = this.questions.filter(
      (question: any) => {
        const questionId = question.id;
        const isVisited =
          this.testObj?.data?.questions[questionId]?.visited ?? false;
        const isAnswered = this.answeredQuestions.some(
          (answered: any) => answered.questionId === questionId
        );
        return isVisited && !isAnswered;
      }
    );
  }

  selectMCQ(event: any, optionIndex: any) {
    const selectedAnswer = this.questions[this.currentQuestion].options[optionIndex];
    const questionId = this.questions[this.currentQuestion].id;
    const timestamp = Date.now(); 
  
    const startTime = this.questionStartTime ? this.questionStartTime.getTime() : 0;
    const timeTakenInSeconds = Math.floor((timestamp - startTime) / 1000);

    this.selectedOptionsMap[questionId] = optionIndex;
    const existingAnswerIndex = this.answeredQuestions.findIndex(
      (q) => q.questionId === questionId
    );
  
    if (existingAnswerIndex !== -1) {
      this.answeredQuestions[existingAnswerIndex].answer = selectedAnswer;
      this.answeredQuestions[existingAnswerIndex].selectedOptionId = optionIndex;
      this.answeredQuestions[existingAnswerIndex].timestamp = timestamp;
      this.answeredQuestions[existingAnswerIndex].timeTaken = timeTakenInSeconds;
    } else {
      this.answeredQuestions.push({
        questionId,
        answer: selectedAnswer,
        selectedOptionId: optionIndex,
        timestamp,
        timeTaken: timeTakenInSeconds,
      });
    }
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
    this.findAnsweredQuestions();
    this.findNotAttemptedQuestions();
    this.findAnsweredQuestionValues();
    this.findVisitedNotAnsweredQuestions();
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  jumpToQuestion(questionIndex: any) {
    this.currentQuestion = questionIndex;
  }

  completeTest() {
    this.end_time = Math.floor(Date.now() / 1000);
    if (this.setIntervalRef) {
      clearInterval(this.setIntervalRef);
    }
    const endTime = new Date(); 
    const totalTimeInSeconds = Math.floor(
      (endTime.getTime() - this.currentTime.getTime()) / 1000
    );
    const formattedTime = this.formatTime(totalTimeInSeconds); 
    localStorage.setItem('totalTimeSpentForExam', formattedTime);

    const score: any = 5;
    document.getElementById('dimissModal')?.click();
    const selected_by_user: any[] = [];
    const allQuestionsInfo = this.questions.map((question) => {
      const answer = this.answeredQuestions.find(
        (a) => a.questionId === question.id
      );
      const selectedOption = answer
        ? this.getOptionLetter(answer.selectedOptionId)
        : '';
        const timeTaken = answer ? answer.timeTaken : 0;
      selected_by_user.push({
        id: question.id,
        selected_answer: selectedOption,
        timeTaken: timeTaken, 
      });
      return {
        id: question.id,
        selected_answer: selectedOption,
      };
    });
    this._loginService.getResult({ selected_by_user, start_time: this.start_time, end_time:this.end_time, quizPoolId:this.quizPoolId }) .subscribe((response: any) => {
        this.UserResultData = response.data;
        localStorage.setItem('result', JSON.stringify(this.UserResultData));
        this._loginService.resultData = this.UserResultData;
        this._sideBar.setSidebarOpen(true);
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = undefined;
        }
        this.isOnExamScreen = false;
        this._router.navigate([`/report`]);
      });
  }

  getOptionLetter(index: number | undefined): string {
    const optionLetters = ['a', 'b', 'c', 'd'];
    return index !== undefined ? optionLetters[index] : '';
  }

  get progressPercentage() {
    const cQuestion = this.answeredQuestionValues.length;
    const percentage = (cQuestion / this.questions.length) * 100;
    return percentage.toFixed(1);
  }
}