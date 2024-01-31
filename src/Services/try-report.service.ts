import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TryReportService {
  public skippedQuestionsSubject = new Subject<any[]>();
  public correctAnswer = new Subject<any[]>();
  public totalMarks = new Subject<any[]>();
  public totalQuestions = new Subject<any[]>();
  public unattempts = new Subject<any[]>();
  public wrongAnswer = new Subject<any[]>();
  
  get skippedQuestions$() {
    return this.skippedQuestionsSubject.asObservable();
  }
  get correctAnswer$() {
    return this.correctAnswer.asObservable();
  }
  get totalMarks$() {
    return this.totalMarks.asObservable();
  }
  get totalQuestions$() {
    return this.totalQuestions.asObservable();
  }
  get unattempts$() {
    return this.unattempts.asObservable();
  }
  get wrongAnswer$() {
    return this.wrongAnswer.asObservable();
  }
}
