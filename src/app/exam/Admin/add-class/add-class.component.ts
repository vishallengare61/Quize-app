import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddQuestionsService } from 'src/Services/add-questions.service';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css']
})
export class AddClassComponent implements OnInit {

  addClassFrom!: FormGroup;
  boardsData:any;
  
  constructor(private _formBuilder: FormBuilder,private _addQuestionsService: AddQuestionsService,private _toastr: ToastrService){}
  ngOnInit(): void {
    this.addClassFrom =  this._formBuilder.group({
      boardName: ['', Validators.required],
      className: ['', Validators.required],
      })
      this.getBoardsData();
  }
  getBoardsData(){
    this._addQuestionsService.getBoards().subscribe((boards:any)=>{
      this.boardsData = boards.boardData;
      console.log('getting boards data', this.boardsData);
      
    })
  }
  selectedBoard(data:any){

  }
  addClass(){
    console.log('getting forms values', this.addClassFrom.value);
    this._toastr.success(`Class Created Successfully`);
    this.addClassFrom.patchValue({
      className: ''
    })
  }
  resetClassForm(){
    this.addClassFrom.reset();
  }
}
