import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AddQuestionsService } from 'src/Services/add-questions.service';

@Component({
  selector: 'app-add-chapters',
  templateUrl: './add-chapters.component.html',
  styleUrls: ['./add-chapters.component.css']
})
export class AddChaptersComponent implements OnInit {

  addChapterForm!: FormGroup;
  boardsData:any
  classData:any;
  SubjectData: any;
  SubjectPartData:any;
  chapterData:any;

  constructor(private _formBuilder: FormBuilder,private _addQuestionsService: AddQuestionsService,private _toastr: ToastrService){

  }
  ngOnInit(): void {
    this.addChapterForm =  this._formBuilder.group({
      boardName: ['', Validators.required],
      className: ['', Validators.required],
      SubjectName: ['', Validators.required],
      SubjectPartName: ['', Validators.required],
      chapterName: ['', Validators.required],
      })
      this.getBoardsData();
  }
  getBoardsData(){
    this._addQuestionsService.getBoards().subscribe((boards:any)=>{
      this.boardsData = boards.boardData;
      console.log('getting boards data', this.boardsData);
      
    })
  }
  selectedBoard(board:any){
    const board_id = board.target.value;
    if (board_id) {
      this._addQuestionsService.getClasses(board_id).pipe(catchError(error=>{
        const errorMessage = error?.error?.message || 'An error occurred';
        this._toastr.error(errorMessage);
        return throwError(error);
      })).subscribe((classeData:any)=>{
        if (classeData.status === false) {
          this._toastr.error(classeData.message);
        }
        this.classData = classeData.allClasses;
      })
    }
    }
    selectedClass(classId:any){
      const class_id = classId.target.value;  
      const selectedOption = classId.target.options[classId.target.selectedIndex];
      const classID = selectedOption.value;  //here getting ID
      const className = selectedOption.text; //here getting name
      if(class_id){
        this._addQuestionsService.getSubjects(class_id)
          .pipe(
            catchError(error => {
              // Handle the error here
              const errorMessage = error?.error?.message || 'An error occurred';
              this._toastr.error(`under ${className} subjects not found!`);
              // this._toastr.error(errorMessage,'under these class subjects not found!');
              return throwError(error); // Rethrow the error after handling
            })
          )
          .subscribe((subjects:any)=>{
            this.SubjectData = subjects.Subjects;
          });
      }
    }
    selectedSubject(subject:any){
      const selectedOption = subject.target.options[subject.target.selectedIndex];
      const subjectId = selectedOption.value;  //here getting ID
      const subjectName = selectedOption.text; //here getting name
      this._addQuestionsService.getSubjectParts(subjectId, subjectName).subscribe((subjectParts:any) =>{
        this.SubjectPartData = subjectParts.all_parts;
      })  
    }
    selectedSubjectPart(parts: any){
      const selectedOption = parts.target.options[parts.target.selectedIndex];
      const subjectId = selectedOption.value;  //here getting ID
      const subjectName = selectedOption.text; //here getting name
    this._addQuestionsService.getChapters(subjectId, subjectName).subscribe((chapter:any)=>{
      this.chapterData = chapter.all_chapters;
    })
    }

    resetClassForm(){
      this.addChapterForm.reset();
    }
    addChapter(){
      const formData = this.addChapterForm.value
      console.log('getting subject_part forms value', formData);
      this._toastr.success(`"${formData.chapterName}" Subject_part Created Successfully`);
      this.addChapterForm.patchValue({
        chapterData: ''
      })
    }
}
