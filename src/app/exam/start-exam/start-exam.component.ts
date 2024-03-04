import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/Services/login.service';
import { TryReportService } from 'src/Services/try-report.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SideBarService } from 'src/Services/side-bar.service';
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
  // Add a variable to store the total time in seconds (30 minutes)
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

  ngOnInit() {
    this._sideBar.setSidebarOpen(false);
    this._sideBar.setExamStarted(true);
    // this.disableBrowserBackButton();
    // this.videoRef = document.getElementById('video');
    // this.setUpCamera();
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

    //getting the difficulty level of selected Mixsubject/Mixparts/chapter
    
    // console.log('getting difficulty level--------------------------------', this.diff_level);
 
    if (this.chapter_id === 'chapterMixTest') {
      this.partsMixTest();
    }else if(this.chapter_id === 'SubjectMixTest'){
      this.subjectMixTest();
    }else{
      this.regularChapterTest();
    }

    // document.addEventListener('visibilitychange', this.handleVisibilityChange);
    // window.addEventListener('beforeunload', this.beforeUnloadHandler);
    // this.chapterWiseTest();
    // this.partsMixtTest();
  }

  ngOnDestroy() {
    // document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    // window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // handleVisibilityChange = () => {
  //   this.navigationAttemptCount++;
  //   console.log('------warning number----------------', this.navigationAttemptCount);
  //   if (document.hidden) {
  //     this._toastr.warning('Please focus on the exam screen.');
  //     window.alert(`you have tried to switch the tab while attendnig the exam, plz dont swith the tab ! IF you switch the tab 3 times then exam will submit atomatically!
  //     current warnig- ${this.navigationAttemptCount -1}`)
  //   }
  //   if (this.navigationAttemptCount === 4) {
  //     this.completeTest();
  //   }
  // };

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event: BeforeUnloadEvent) {
  //   event.preventDefault();
  //   event.returnValue = 'Are you sure you want to leave the exam?'; 
  //   return event.returnValue;
  // }


  // setUpCamera() {
  //   navigator.mediaDevices.getUserMedia({
  //     video: { width: 100, height: 100 },
  //     audio: false
  //   }).then(stream => {
  //     this.stream = stream;
  //     this.videoRef.srcObject = stream;
  //   }).catch(error => {
  //     console.error('Error accessing camera:', error);
  //   });
  // }

  disableBrowserBackButton() {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
    };
  }

  regularChapterTest(){
    // console.log('RegularchapterTest is colling');
    this._loginService.getQuestions(this.subjectName, this.chapter_id, this.class_id) .subscribe( (apiResponse: any) => {
      this.showLoader = false;
      this.quizPoolId = apiResponse.quizPoolId;
      // console.log('getting the quizPoolId ------------', apiResponse.quizPoolId);
      // console.log('chapterwise  question.s ------------', apiResponse);
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
              // correctAnswer: // Your logic to map the correct answer based on the API response,
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
  // console.log('partsMixtTest is colling');
  
  const modal = {part_id: parseInt(this.part_id), no_of_question: parseInt(this.q_count)};

  this._loginService.getMixQuestions(modal).subscribe( (apiResponse: any) => {
    this.showLoader = false;
    this.quizPoolId = apiResponse.quizPoolId;
    // console.log('Mix question.s ------------', apiResponse);

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
            // correctAnswer: // Your logic to map the correct answer based on the API response,
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
  //here in subject Name for these method only we are getting the subject ID.
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
            // correctAnswer: // Your logic to map the correct answer based on the API response,
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
    // if (this.totalTimeInSeconds > 0) {
    // this.totalTimeInSeconds -= 1;

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
      // Timer reached zero, handle the event (e.g., display a message, complete the test)
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
  
  // Find Answered Questions
  findAnsweredQuestions() {
    const answeredQuestions = this.answeredQuestions.map((answer) => {
      const question = this.questions.find(
        (q: any) => q.id === answer.questionId
      );
      return { ...answer, question };
    });
    // console.log('Answered Questions:', answeredQuestions);
  }
  findAnsweredQuestionValues() {
    this.answeredQuestionValues = this.answeredQuestions.map((answer) => {
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.answer,
        selectedOptionId: answer.selectedOptionId,
      };
    });
    // console.log('Answered Questions Values:', this.answeredQuestionValues);
  }
  // Find Not Attempted Questions
  findNotAttemptedQuestions() {
    this.notAttemptedQuestions = this.questions.filter((question: any) => {
      return !this.answeredQuestions.some(
        (answer) => answer.questionId === question.id
      );
    });
    // console.log('not attempted questions --',this.notAttemptedQuestions);
  }
  findVisitedNotAnsweredQuestions() {
    this.visitedNotAnsweredQuestions = this.questions.filter(
      (question: any) => {
        // Check if the question is visited but not answered
        const questionId = question.id;
        const isVisited =
          this.testObj?.data?.questions[questionId]?.visited ?? false;
        const isAnswered = this.answeredQuestions.some(
          (answered: any) => answered.questionId === questionId
        );
        return isVisited && !isAnswered;
      }
    );
    // console.log('Visited but not Answered Questions:', this.visitedNotAnsweredQuestions);
  }
  selectMCQ(event: any, optionIndex: any) {
    const selectedAnswer = this.questions[this.currentQuestion].options[optionIndex];
    const questionId = this.questions[this.currentQuestion].id;
    const timestamp = Date.now(); // Record current timestamp
  
    // Calculate time taken for the current question in seconds
    const startTime = this.questionStartTime ? this.questionStartTime.getTime() : 0;
    const timeTakenInSeconds = Math.floor((timestamp - startTime) / 1000);
  
    // Store time taken along with other answer details
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
  
    // console.log('question and answer------', this.answeredQuestions);
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
      // console.log(Question ID: ${currentQuestionId}, Attempted Answer: ${attemptedAnswer.answer});
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
    // Create a separate array with information about all questions
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
        // console.log('getting result-------', response.data);
        this.UserResultData = response.data;
        localStorage.setItem('result', JSON.stringify(this.UserResultData));
        this._loginService.resultData = this.UserResultData;
        this._sideBar.setSidebarOpen(true);
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = undefined;
        }
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