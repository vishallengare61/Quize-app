import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-choose-p',
  templateUrl: './choose-p.component.html',
  styleUrls: ['./choose-p.component.css']
})
export class ChoosePComponent implements OnInit {

  constructor(){}
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.init();
    }, 400); 
  }

}
