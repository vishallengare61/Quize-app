import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AddQuestionsService } from 'src/Services/add-questions.service';

@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.css']
})
export class AddSubjectsComponent implements OnInit {

  addSubjectFrom!: FormGroup;
  boardsData:any
  classData:any;

  constructor(private _formBuilder: FormBuilder,private _addQuestionsService: AddQuestionsService,private _toastr: ToastrService){}
  ngOnInit(): void {
      this.addSubjectFrom =  this._formBuilder.group({
      boardName: ['', Validators.required],
      className: ['', Validators.required],
      SubjectName: ['', Validators.required],
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
    selectedClass(classData: any){
    }


    addSubject(){
      const formData = this.addSubjectFrom.value;
    // console.log('getting forms values', formData.SubjectName);
    this._toastr.success(`"${formData.SubjectName}" Subject Created Successfully`);
    this.addSubjectFrom.patchValue({
      SubjectName: ''
    })
  }
  resetClassForm(){
    this.addSubjectFrom.reset();
  }
}
