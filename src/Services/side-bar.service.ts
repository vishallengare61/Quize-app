import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private sidebarOpenSubject = new BehaviorSubject<boolean>(true);
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  private examStartedSubject = new BehaviorSubject<boolean>(false);
  examStarted$: Observable<boolean> = this.examStartedSubject.asObservable();
  

  constructor() { }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpenSubject.next(open);
  }
  setExamStarted(started: boolean): void {
    this.examStartedSubject.next(started);
  }

  // isExamStarted(): Observable<boolean> {
  //   return this.examStarted$;
  // }

}
