import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
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
  imageOptions: string[] = ['A', 'B', 'C', 'D']; // Array to hold options images dynamically
  diff_level: number = 0;
  changedAnsKey : any;


  questionImage: File | null = null;
  OptionImageA: File | null = null;
  OptionImageB: File | null = null;
  OptionImageC: File | null = null;
  OptionImageD: File | null = null;
  optionImages: { [key: string]: File | null } = {};

  

  questionImg: boolean = false;
  optionImgA: boolean = false;
  optionImgB: boolean = false;
  optionImgC: boolean = false;
  optionImgD: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _addQuestionsService: AddQuestionsService, private _toastr: ToastrService){}

  ngOnInit(): void {
   this.addQuestionsFrom =  this._formBuilder.group({
    boardName: ['', Validators.required],
    className: ['', Validators.required],
    subjectName: ['', Validators.required],
    partName: ['', Validators.required],
    chapterName: ['', Validators.required],
    enterQuestion: ['', Validators.required],
    questionImage: [''],
    optiona: ['', Validators.required],
    imagea: [''],
    optionb: ['', Validators.required],
    imageb: [''],
    optionc: ['', Validators.required],
    imagec: [''],
    optiond: ['', Validators.required],
    imaged: [''],
    correctAns: ['', Validators.required],
    diff_level: [this.diff_level],
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
        this.subjectsData = subjects.Subjects;
      });
  }
}

selectedDiff_level(diff_level:any){
  const level_id = diff_level.target.value;  
  this.diff_level = level_id;
  // const level_name = diff_level.target.options[diff_level.target.selectedIndex];
  // const classID = level_name.value;  
  // const className = level_name.text; 
 
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
  const optionValues = [
    { value: this.addQuestionsFrom.value.imagea, label: 'Image A' },
    { value: this.addQuestionsFrom.value.imageb, label: 'Image B' },
    { value: this.addQuestionsFrom.value.imagec, label: 'Image C' },
    { value: this.addQuestionsFrom.value.imaged, label: 'Image D' }
  ];
  this.imageOptions = optionValues.map(option => option.value ? option.label + ' (' + (option.value ? option.value.name : 'No file selected') + ')' : '');
}



  onQuestionImageChange(event: any) {
    this.questionImage = event.target.files[0];
    console.log('onQuestionImageChanged----', this.questionImage);
    
  }

  onOptionImageChangeA(option: string, event: any) {
    this.OptionImageA = event.target.files[0];
    console.log('Received file:', this.OptionImageA);
    if (this.OptionImageA) {
      this.optionImages[option] = this.OptionImageA;
      console.log('onOptionImageChange----', this.optionImages[option]);
      this.updateOptions(); 
    }
  }
  onOptionImageChangeB(option: string, event: any) {
    this.OptionImageB = event.target.files[0];
    console.log('Received file:', this.OptionImageB);
    if (this.OptionImageB) {
      this.optionImages[option] = this.OptionImageB;
      console.log('onOptionImageChange----', this.optionImages[option]);
      this.updateOptions(); 
    }
  }
  onOptionImageChangeC(option: string, event: any) {
    this.OptionImageC = event.target.files[0];
    console.log('Received file:', this.OptionImageC);
    if (this.OptionImageC) {
      this.optionImages[option] = this.OptionImageC;
      console.log('onOptionImageChange----', this.optionImages[option]);
      this.updateOptions(); 
    }
  }
  onOptionImageChangeD(option: string, event: any) {
    this.OptionImageD = event.target.files[0];
    console.log('Received file:', this.OptionImageD);
    if (this.OptionImageD) {
      this.optionImages[option] = this.OptionImageD;
      console.log('onOptionImageChange----', this.optionImages[option]);
      this.updateOptions(); 
    }
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
      // Access file properties
  const questionImageData = this.addQuestionsFrom.value.questionImage;
  const optionAImageData = this.addQuestionsFrom.value.imagea;
  const optionBImageData = this.addQuestionsFrom.value.imageb;
  const optionCImageData = this.addQuestionsFrom.value.imagec;
  const optionDImageData = this.addQuestionsFrom.value.imaged;
  
    // const questionData = {
    //   question: this.addQuestionsFrom.value.enterQuestion,
    //   questionImage: this.addQuestionsFrom.value.questionImage,
    //   optiona: this.addQuestionsFrom.value.optiona,
    //   imagea: this.addQuestionsFrom.value.imagea,
    //   optionb: this.addQuestionsFrom.value.optionb,
    //   imageb: this.addQuestionsFrom.value.imageb,
    //   optionc: this.addQuestionsFrom.value.optionc,
    //   imagec: this.addQuestionsFrom.value.imagec,
    //   optiond: this.addQuestionsFrom.value.optiond,
    //   imaged: this.addQuestionsFrom.value.imaged,
    //   subject_id: this.addQuestionsFrom.value.subjectName,
    //   chapter_id: this.addQuestionsFrom.value.chapterName,
    //   part_id: this.addQuestionsFrom.value.partName,
    //   answerkey: this.changedAnsKey,
    //   hint: this.changedAnsKey, 
    //   diff_level: "0" 
    // };

    const questionData = {
      question: this.addQuestionsFrom.value.enterQuestion,
      questionImage: this.questionImage,
      optiona: this.addQuestionsFrom.value.optiona,
      imagea: this.OptionImageA,
      optionb: this.addQuestionsFrom.value.optionb,
      imageb: this.OptionImageB,
      optionc: this.addQuestionsFrom.value.optionc,
      imagec: this.OptionImageC,
      optiond: this.addQuestionsFrom.value.optiond,
      imaged: this.OptionImageD,
      subject_id: this.addQuestionsFrom.value.subjectName,
      chapter_id: this.addQuestionsFrom.value.chapterName,
      part_id: this.addQuestionsFrom.value.partName,
      answerkey: this.changedAnsKey,
      hint: this.changedAnsKey, 
      diff_level: this.diff_level 
    };

    

    console.log('getting froms value----', questionData);

    // this._addQuestionsService.createQuestion(questionData).subscribe((result:any) => {
    //   console.log('question is created successfully----', result);
    //   this._toastr.success(result.message)
    // });
    
    // Reset specific form controls
  this.addQuestionsFrom.patchValue({
    enterQuestion: '',
    optiona: '',
    optionb: '',
    optionc: '',
    optiond: '',
    correctAns: '',
    diff_level: '',
    questionImage: '',
    imagea: '',
    imageb: '',
    imagec: '',
    imaged: '',
  });
  }

  resetAddQuestionForm(){
    this.addQuestionsFrom.reset();
  }

  AddQuetionImg(){
    this.questionImg = !this.questionImg;
  }
  AddOptionAImg(){
    this.optionImgA = !this.optionImgA;
  }
  AddOptionBImg(){
    this.optionImgB = !this.optionImgB;
  }
  AddOptionCImg(){
    this.optionImgC = !this.optionImgC;
  }
  AddOptionDImg(){
    this.optionImgD = !this.optionImgD;
  }
}
