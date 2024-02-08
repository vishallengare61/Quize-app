import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AddQuestionsService } from 'src/Services/add-questions.service';

@Component({
  selector: 'app-add-subjects-part',
  templateUrl: './add-subjects-part.component.html',
  styleUrls: ['./add-subjects-part.component.css']
})
export class AddSubjectsPartComponent implements OnInit {

  addSubject_PartForm!: FormGroup;
  boardsData:any
  classData:any;
  SubjectData: any;
  
  constructor(private _formBuilder: FormBuilder,private _addQuestionsService: AddQuestionsService,private _toastr: ToastrService){};
  ngOnInit(): void {
    this.addSubject_PartForm =  this._formBuilder.group({
      boardName: ['', Validators.required],
      className: ['', Validators.required],
      SubjectName: ['', Validators.required],
      SubjectPartName: ['', Validators.required],
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
    addSubjectPart(){
      const formData = this.addSubject_PartForm.value
      console.log('getting subject_part forms value', formData.SubjectPartName);
      this._toastr.success(`"${formData.SubjectPartName}" Subject_part Created Successfully`);
      this.addSubject_PartForm.patchValue({
        SubjectPartName: ''
      })
    }
    selectedSubject(subject_partId: any){
      console.log('selected subject', subject_partId.target.value);
      
    }
    resetClassForm(){
      this.addSubject_PartForm.reset();
    }

}
