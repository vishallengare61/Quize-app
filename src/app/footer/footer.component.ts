import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{

  constructor(private viewportScroller: ViewportScroller,) { 

  }
  activateGoTop! : boolean;

  onClickScroll(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  @HostListener('window:scroll',[])
  onWindowScroll() {
       if ( window.scrollY > 500 ) {
          this.activateGoTop = true;
       } else {
          this.activateGoTop = false;
       }
   }

   

  ngOnInit(): void {
    this.activateGoTop = false;
  }

}
