import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { LoginService } from 'src/Services/login.service';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {

currentQuestionIndex: number = 0;
  selectedOption: number | null = null;
  showResult: boolean = false;



@ViewChild('closeModald') closeModald!: ElementRef;
chooseSubjectsFlag: boolean = true;
difficulty: number = 0;
totalusers!:any;
abcd:boolean = true;
efgh:boolean = false;
selectedChapterid!:any;
ifanydifficulty: boolean = false;
unSelectPart:boolean = true;
selectedCount: number = 25;
selectedCount2: number = 25;

//try to set the deficulty level.

// difficulty: number = 0;
// difficulty: number = 1;

@ViewChild("myckeditor", {static: false}) ckeditor: any;
@ViewChild('widgetsContent') widgetsContent!: ElementRef;

id:any;
name:any;
subject_id:any;
all_parts: any[] = [];
chaptersData: any[] = [];
subjectPartsVailable:boolean = false;
showLoader:boolean = true;
partsLength: boolean = false;

parts_id: any;
parts_name:any;


  constructor(private _router: Router, private _loginService: LoginService, private _route: ActivatedRoute, private _toastr: ToastrService){ }

  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.name = this._route.snapshot.paramMap.get('s_name'); 
    this.subject_id = this._route.snapshot.paramMap.get('id');  // subject_id
    // console.log('geting subject name', this.name)
    // console.log('geting subject id', this.subject_id)
    this._loginService.getSubjectParts(this.subject_id, this.name).subscribe((subjectPart:any)=>{
      if (subjectPart) {
        this.showLoader = false;
        this.all_parts = subjectPart.all_parts;
        // console.log('All parts length--------', this.all_parts.length);
        if (this.all_parts.length > 1) {
          this.partsLength = true;
        }
      }
    })
  }
  selectOption(index: number) {
    this.selectedOption = index;
  }

getPartsID(id:number, name:any){
  // console.log('getPartsID and Name', id, name);
  this.parts_id = id;
  localStorage.setItem('parts_id', this.parts_id);
  this.parts_name = name;
  this._loginService.getChapters(id, name).pipe( catchError(error => {
    console.log('getting the parts data--', error);
        const errorMessage = error?.error?.message || 'An error occurred';
        this._toastr.error(errorMessage);
        this.subjectPartsVailable = false;
        this.unSelectPart = true;
        return throwError(error); 
      })
    ).subscribe((chapters:any) =>{
      console.log('getting the parts data--', chapters);
      if (chapters.status === false) {
        this.unSelectPart = true;
        this._toastr.error(chapters.message);
      }
      this.chaptersData = chapters.all_chapters;   
      this.unSelectPart = false;   
      if(this.chaptersData){
        this.subjectPartsVailable = true;
      }
    });
}

TakeMixChapterTest(){
  // may be need to pass the mix text id
}
saveChapterId(id:any){
  this.selectedChapterid = id;
  // console.log('selected chapter ID',this.selectedChapterid);
  this.selectDifficultyLevel(2, 5);
}



  slideRight(){
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
  slideLeft(){
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }


  selectDifficultyLevel(i:number, level:number) {
    this.ifanydifficulty = false;
    this.difficulty = level;
    let id = "";
    for (let i = 1; i < 4; i++){
      id = "regi" + i;
      document.getElementById(id)?.classList.remove("selected");
    }
    id = "";
    id = "regi" + i;
    document.getElementById(id)?.classList.add("selected");
    document.getElementById('allrange')?.classList.remove("selected");
  }

  selectAnyRange() {
    this.ifanydifficulty = true;
    let id = "";
    for (let i = 1; i < 4; i++){
      id = "regi" + i;
      document.getElementById(id)?.classList.remove("selected");
    }
    document.getElementById('allrange')?.classList.add("selected");
  }

  // @ViewChild('myModal') myModal!: ModalDirective;

  submitFilterForm(){
    this._router.navigate([`/start-Exam/${this.name}/${this.selectedChapterid}/${this.selectedCount}/${this.difficulty}`]);
  }

  TakeMixTest(){
    const mixTest = 'chapterMixTest'
    console.log('Selected Value:', this.difficulty);
    this._router.navigate([`/start-Exam/${this.name}/${mixTest}/${this.selectedCount}/${this.difficulty}`]);
  }
  TakeSubjectMixTest(){
    const mixTest = 'SubjectMixTest'
    const diff_level = this.difficulty;
    // console.log('Selected Value:', this.selectedCount2);
    this._router.navigate([`/start-Exam/${this.subject_id}/${mixTest}/${this.selectedCount2}/${this.difficulty}`]);
  }

  //if you want to open the new page on blank page while navigatting via programmatically then use below approach.

  // TakeSubjectMixTest(){
  //   const mixTest = 'SubjectMixTest'
  //   console.log('Selected Value:', this.selectedCount2);
  //   const url = `/start-Exam/${this.subject_id}/${mixTest}/${this.selectedCount2}/start-Exam/`;
  //   window.open(url, '_blank');
  // }
  
  getMixPartsTest(){

  }
}
