import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
difficulty: number = 5;
totalusers!:any;
abcd:boolean = true;
efgh:boolean = false;
selectedChapterid!:any;
ifanydifficulty: boolean = false;
unSelectPart:boolean = true;

@ViewChild("myckeditor", {static: false}) ckeditor: any;
@ViewChild('widgetsContent') widgetsContent!: ElementRef;

id:any;
name:any;
subject_id:any;
all_parts: any[] = [];
chaptersData: any[] = [];
subjectPartsVailable:boolean = false;
showLoader:boolean = true;

  constructor(private _router: Router, private _loginService: LoginService, private _route: ActivatedRoute){ }

  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.name = this._route.snapshot.paramMap.get('s_name');
    this.subject_id = this._route.snapshot.paramMap.get('id');
    this._loginService.getSubjectParts(this.subject_id, this.name).subscribe((subjectPart:any)=>{
      if (subjectPart) {
        this.showLoader = false;
        this.all_parts = subjectPart.all_parts;
      }
    })
  }
  selectOption(index: number) {
    this.selectedOption = index;
  }
  getPartsID(id:number, name:any){
    this.unSelectPart = false;
    this._loginService.getChapters(id, name).subscribe((chapters:any) =>{
      this.chaptersData = chapters.all_chapters;
      if(this.chaptersData){
        this.subjectPartsVailable = true;
      }
    });
  }
  slideRight(){
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
  slideLeft(){
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }
  saveChapterId(id:any){
    this.selectedChapterid = id;
    console.log('selected chapter ID',this.selectedChapterid);
    this.selectDifficultyLevel(2, 5);
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
    this._router.navigate([`/start-Exam/${this.name}/${this.selectedChapterid}`]);
  }
}
