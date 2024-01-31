import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.css']
})
export class HomeContentComponent implements OnInit {

  // ripple:boolean = true;
  // noripple:boolean = false;
  constructor(){}

  ngOnInit(): void {
  //  setTimeout(() => {
  //   this.ripple = !this.ripple;
  //   this.noripple = !this.noripple;
  //  }, 2000);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.init();
    }, 300); // Adjust the delay time as needed
  }

  examCategories:any;
  kdomains:any;
  entrancedomains:any;
  jobdomains:any;

  selectCourse(domain:any){

  }
  openRegisterStudent(){

  }
  openRegisterMentor(){
    
  }
}
