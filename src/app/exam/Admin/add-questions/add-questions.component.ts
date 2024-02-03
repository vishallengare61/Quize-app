import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddQuestionsService } from 'src/Services/add-questions.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.css']
})
export class AddQuestionsComponent implements OnInit {

  addQuestionsFrom!: FormGroup;
  boardsData:any;
  classData:any;
  subjectsData:any;
  subjectPartsData:any;
  chaptersData:any;
  options: string[] = ['A', 'B', 'C', 'D']; // Array to hold options dynamically

  changedAnsKey : any;

  constructor(private _formBuilder: FormBuilder, private _addQuestionsService: AddQuestionsService, private _toastr: ToastrService){}

  ngOnInit(): void {
   this.addQuestionsFrom =  this._formBuilder.group({
    boardName: ['', Validators.required],
    className: ['', Validators.required],
    subjectName: ['', Validators.required],
    partName: ['', Validators.required],
    chapterName: ['', Validators.required],
    enterQuestion: ['', Validators.required],
    optiona: ['', Validators.required],
    optionb: ['', Validators.required],
    optionc: ['', Validators.required],
    optiond: ['', Validators.required],
    correctAns: ['', Validators.required],
    })

    this.getBoardsData();
  }

  getBoardsData(){
    this._addQuestionsService.getBoards().subscribe((boards:any)=>{
      this.boardsData = boards.boardData;
    })
  }

selectedBoard(board:any){
const board_id = board.target.value;
if (board_id) {
  this._addQuestionsService.getClasses(board_id).subscribe((classeData:any)=>{
    this.classData = classeData.allClasses;
  })
}
}

selectedClass(classId:any){
  const class_id = classId.target.value;
  console.log('you have selected class id---', class_id);
  
  if(class_id){
    this._addQuestionsService.getSubjects(class_id).subscribe((subjects:any)=>{
      this.subjectsData = subjects.Subjects;

    })
  }
}
selectedSubject(subject:any){
  const selectedOption = subject.target.options[subject.target.selectedIndex];
  const subjectId = selectedOption.value;  //here getting ID
  const subjectName = selectedOption.text; //here getting name
  this._addQuestionsService.getSubjectParts(subjectId, subjectName).subscribe((subjectParts:any) =>{
    this.subjectPartsData = subjectParts.all_parts;
  })  
}
selectedSubjectPart(parts: any){
  const selectedOption = parts.target.options[parts.target.selectedIndex];
  const subjectId = selectedOption.value;  //here getting ID
  const subjectName = selectedOption.text; //here getting name
this._addQuestionsService.getChapters(subjectId, subjectName).subscribe((chapter:any)=>{
  this.chaptersData = chapter.all_chapters;
})
}
selectedChapters(chapters:any){
  // console.log('getting the chapters Data-----', chapters.target.value);
  
}

updateOptions() {
  this.options = [
    this.addQuestionsFrom.value.optiona,
    this.addQuestionsFrom.value.optionb,
    this.addQuestionsFrom.value.optionc,
    this.addQuestionsFrom.value.optiond
  ];
}

  addQuestion(){
    this.changedAnsKey =this.options.indexOf(this.addQuestionsFrom.value.correctAns.toLowerCase()) + 1;
    if (this.changedAnsKey == 1) {
      this.changedAnsKey  = 'a'
    }else if(this.changedAnsKey == 2){
      this.changedAnsKey  = 'b'
    }else if(this.changedAnsKey == 3){
      this.changedAnsKey  = 'c'
    }else if(this.changedAnsKey == 4){
      this.changedAnsKey  = 'd'
    }
    const questionData = {
      question: this.addQuestionsFrom.value.enterQuestion,
      optiona: this.addQuestionsFrom.value.optiona,
      optionb: this.addQuestionsFrom.value.optionb,
      optionc: this.addQuestionsFrom.value.optionc,
      optiond: this.addQuestionsFrom.value.optiond,
      subject_id: this.addQuestionsFrom.value.subjectName,
      chapter_id: this.addQuestionsFrom.value.chapterName,
      part_id: this.addQuestionsFrom.value.partName,
      answerkey: this.changedAnsKey,
      hint: this.changedAnsKey, // You can modify this based on your requirements
      diff_level: "0" // You can modify this based on your requirements
    };
    console.log('getting froms value----', questionData);

    this._addQuestionsService.createQuestion(questionData).subscribe((result:any) => {
      console.log('question is created successfully----', result);
      this._toastr.success(result.message)
    });
    
    // Reset specific form controls
  this.addQuestionsFrom.patchValue({
    enterQuestion: '',
    optiona: '',
    optionb: '',
    optionc: '',
    optiond: '',
    correctAns: ''
  });


  }

  resetAddQuestionForm(){
    this.addQuestionsFrom.reset();
  }
}
