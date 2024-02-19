import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private _isSidebarOpen = new BehaviorSubject<boolean>(true);
  isSidebarOpen$ = this._isSidebarOpen.asObservable();
  isExamStarted: boolean = false;
  constructor() { }

  toggleSidebar() {
    this._isSidebarOpen.next(!this._isSidebarOpen.value);
  }

  startExam() {
    this.isExamStarted = true;
    this.toggleSidebar(); // Hide the sidebar when exam starts
  }

  endExam() {
    this.isExamStarted = false;
  }
}
