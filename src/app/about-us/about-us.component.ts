import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  ngOnInit(): void {
  
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.init();
    }, 300); 
  }

}
