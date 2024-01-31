import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'
@Component({
    selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit{

  constructor(){

  }

  ngOnInit(): void {

}
ngAfterViewInit(): void {
  setTimeout(() => {
    AOS.init();
  }, 300); // Adjust the delay time as needed
}


}
