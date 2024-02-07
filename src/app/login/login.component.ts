import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, NgForm } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BootstrapService } from 'src/Services/bootstrap.service';
import { LoginService } from 'src/Services/login.service';
import { RegisterService } from 'src/Services/register.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  showHomeContent: boolean = true;
  showAboutSection = false;
  showGoalsSection = false;
  showContactSection = false;
  showFaqSection = false;

  boardData: any;
  classData: any;
  user = {};

  phoneNumber: any;
  otp: any;
  showLogin: boolean = true;
  showRegister: boolean = false;
  showOtp: boolean = false;
  registrationPhoneNumber: string = "";
  name: string = '';
  validLoginNo: boolean = false;
  showOtpRegister: boolean = false;
  passwordLogin: boolean = true;
  phonepattern = /^[6-9]\d{9}$/;
  otppattern = /^[0-9]\d{6}$/;
  namepattern = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
  password: any;
  signupAsStudent: boolean = true;
  activeCard: string = "student";
  timer: number = 30;
  timervar: any;
  registrationOTP: any;
  validName: boolean = false;
  activeFaq: boolean = false;
  activeAssociation: boolean = false;
  activeAbout: boolean = false;
  activeGoal: boolean = false;
  activeHome: boolean = false;
  private routerSubscription!: Subscription;
  ModelPopUp: boolean = false;




  isLogin: boolean = true;
  isRegister: boolean = false;
  registerStudentForm!: FormGroup;
  registerForm!: FormGroup;
  class_id:any;

  constructor(private _router: Router, private formBuilder: FormBuilder, private _loginService: LoginService, private _toastr: ToastrService, private _bt: BootstrapService, private _registerService: RegisterService){}


  ngOnInit(): void {
    this.registerStudentForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      selectedBoard: ['', Validators.required],
      class_register_id: ['', Validators.required],
      user_type: ['Student']
    }, {
      // validators: this.passwordMatchValidator.bind(this)
    });

    this.registerForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user_type: ['Mentor']
    });

    //getBoards
    this._registerService.getBoard().subscribe((board:any) => {
      this.boardData = board.boardData;
    })
    localStorage.removeItem('user');
    localStorage.clear();

    //IMPORTANT-->
    this.routerSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Remove modal backdrop on navigation start
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
      if (event instanceof NavigationEnd) {
        // Ensure modal backdrop is removed after navigation is complete
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
    });

  }

  getBoards(){
    
  }

  onBoardSelectionChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue) {
       this._registerService.getclassData(selectedValue).subscribe({
           next: (classes: any) => {
             console.log('getting classes based on selected board--', classes)
               this.classData = classes.allClasses;
              //  console.log('getting classes based on selected board--', classes.error.message)
           },
           error: (error: any) => {
               if (error.status === 404) {
                   console.log('getting the error response---------', error.error.message);
                   this._toastr.error(error.error.message);
               } else {

               }
           }
       });
    }
}


onClassSelectionChange(event: any){
  const selectedValue = event.target.value;
  if (selectedValue) {
    console.log('getting the selected class value', selectedValue);
    
  }
}

  toggleSection(section: string) {
    this.showHomeContent = false;
    this.showAboutSection = section === 'about';
    this.showHomeContent = section === 'home';
    this.showGoalsSection = section === 'goals';
    this.showContactSection = section === 'contactUs';
    this.showFaqSection = section === 'faq';
  }

  // passwordMatchValidator(formGroup: FormGroup) {
  //   const password = formGroup.get('password')?.value;
  //   const confirmPassword = formGroup.get('confirmPassword')?.value;
  //   if (password !== confirmPassword) {
  //     formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
  //   } else {
  //     formGroup.get('confirmPassword')?.setErrors(null);
  //   }

  // }
  changeLoginForm(){
    this.isLogin =false;
    this.isRegister = true;
  }
  changeRegisterForm(){
    this.isLogin = true;
    this.isRegister = false;
  }

  loginUser(user:any){
    this._bt.hideModal();
    this._loginService.loginUser(user).subscribe((result:any)=>{
      console.log('getting data of logged in user-----',result);
      if (result) {
        this._toastr.success(result.user.message);
        // const userToken = result.user.token;
        // localStorage.setItem('userToken', userToken);
        localStorage.setItem('user', JSON.stringify(result));
        // this.class_id = result.user.class_id[0]
        // localStorage.setItem('id',this.class_id);
        this._router.navigate(['/dashboard']);
      }
    })  
    console.log('login credentials-', user);
  }

  showLoginForm() {
    this.ModelPopUp = true;
    this.phoneNumber = null;
    this.showLogin = true;
    this.showOtp = false;
  }
  openRegister() {
    this.registrationPhoneNumber = '';
    this.name = '';
    this.showLogin = false;
    this.validLoginNo = false;
    this.showOtpRegister = false;
  }
  validateLoginNumber() {
    if (!this.phoneNumber.match(this.phonepattern)) {
      this.validLoginNo = false;
    }
    else {
      this.validLoginNo = true;
    }
  }

  loginUsingPassword() {

    const username = this.phoneNumber;
    const password = this.password;
    this._bt.hideModal();
  }

  signUpStudent() {
    this.signupAsStudent = true;
    this.activeCard = 'student';
  }

  signUpTeacher() {
    this.signupAsStudent = false;
    this.activeCard = 'teacher';

  }

  sendOTPRegister(){

  }
  verifyOtp(otp:any) {

  }
  register() {
    if (this.registerStudentForm.valid) {
      const formValues = this.registerStudentForm.value;
      const user = {
        user_type: formValues.user_type,
        fullname: formValues.fullname,
        phonenumber: formValues.phonenumber,
        class_register_id: [formValues.class_register_id],
        password: formValues.password
      };

      console.log('getting student register value--', user);
      
      this._registerService.registerUser({user}).subscribe((result:any)=>{
        console.log('Student Registered-----',result);
        this._toastr.success('registration Success!');
      })
      this.registerStudentForm.reset();
    } else {
      // Handle form validation errors if needed
      this._toastr.error('registration failed!')
    }
  }

  registerMentor(){
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;

      const user = {
        user_type: formValues.user_type,
        fullname: formValues.fullname,
        phonenumber: formValues.phonenumber,
        password: formValues.password,
        class_register_id: [" "],
      };
      console.log('register as mentor form--', user);
      
      this._registerService.registerUser({user}).subscribe((result:any)=>{
        console.log('Mentor Registered-----',result);
        this._toastr.success('registration Success!');
      })
      this.registerStudentForm.reset();
    }else {
      this._toastr.error('registration failed!')
    }
  }

  validateSignUpName() {
    if (!this.name.match(this.namepattern)) {
      this.validName = false;
    }
    else {
      this.validName = true;
    }
  }

  validateSignUpNumber() {
    if (!this.registrationPhoneNumber.match(this.phonepattern)) {
      this.validLoginNo = false;
    }
    else {
      this.validLoginNo = true;
    }
  }

  ngOnDestroy() {
    // Unsubscribe from router events when component is destroyed
    this.routerSubscription.unsubscribe();
  }

}
