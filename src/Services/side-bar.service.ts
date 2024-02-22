import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private isSidebarOpenSubject = new BehaviorSubject<boolean>(true);
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();

  constructor() { }

  toggleSidebar(isOpen: boolean) {
    this.isSidebarOpenSubject.next(isOpen);
    console.log('toggleSidebar---',this.isSidebarOpenSubject.next(isOpen));
  }
}
