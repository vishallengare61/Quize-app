import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentHistoryService } from 'src/Services/student-history.service';

@Component({
  selector: 'app-mix-test-details',
  templateUrl: './mix-test-details.component.html',
  styleUrls: ['./mix-test-details.component.css']
})
export class MixTestDetailsComponent implements OnInit {

  testType: any;
  testData: any;



  allItems: any;
  paginatedItems: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;
  spinner: boolean = false;
  total_questions:any;
  total_paper_time:any;
  allResultData:any;
  UserResultData: any[] = [];

  showLoader: boolean = true;

  latestTests: any;
  subjectsMixTestsLength: any;
  partsMixTestsLength: any;
  chaptersMixTestsLength: any;

  constructor(private _activateRoute: ActivatedRoute, private _router: Router, private _historyService: StudentHistoryService){

  }
  ngOnInit(): void {

   this.testType = this._activateRoute.snapshot.paramMap.get('test_type');
   console.log(this.testType);
   this.getAllHistory();
  }

  getAllHistory() {
    this._historyService.getAllHistory().subscribe((result: any) => {
      // console.log(result);
      this.showLoader = false;
      if (this.testType === 'subjectMixTest') {
        this.allItems = result.subjectTests;
        console.log(this.allItems);
      } else if (this.testType === 'partsMixTest') {
        this.allItems = result.partTests;
        console.log(this.allItems);
      } else if (this.testType === 'chaptersMixTest') {
        this.allItems = result.chapterTests;
        console.log(this.allItems);
      }
      this.calculatePagination(); // Call calculatePagination after assigning allItems
    });
  }
  
  calculatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.allItems.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.allItems.length / this.itemsPerPage);
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  slideLeft() {
    this.goToPage(this.currentPage - 1);
  }

  slideRight() {
    this.goToPage(this.currentPage + 1);
  }

  examDetails(quizeId:any){
    // console.log('getting the quiz pool ID----',quizeId);
    this._router.navigate([`examDetails/${quizeId}`]);
    
  }


  reportCard(quizeId:any, quizName: any){
    const reports = true;
    // console.log('getting quiz card ID--', quizeId);
    this._historyService.getQuizeResult(quizeId).subscribe((result: any) => {

      console.log('getting the API response',result);
      this.UserResultData = result.data;
      console.log('getting the API response',this.UserResultData);

      localStorage.setItem('result', JSON.stringify(this.UserResultData));
      this._router.navigate([`/quize_report/${quizeId}`]);
});
  }


}
