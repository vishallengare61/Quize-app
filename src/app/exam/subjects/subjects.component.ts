import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/Services/login.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent {

  id:any;
  token:any;
  parseUserData:any;
  subjects: any[] = [];
  showLoader:boolean = true;
  constructor(private _route: ActivatedRoute, private _router: Router, private _loginService: LoginService){

  }
  ngOnInit(): void {
    this.parseUserData = localStorage.getItem('user');
    if (this.parseUserData!=  null) {
      const parseData = JSON.parse(this.parseUserData);
      this.id = parseData.user.class_id[0];
      this.token = parseData.user.token;
      this._loginService.getSubject(this.id).subscribe((subject: any) => {
        // console.log('getting subjects', subject);
        if (subject) {
          this.showLoader = false;
          this.subjects = subject.Subjects;
          for (let i = 0; i < this.subjects.length; i++) {
            const subjectData = this.subjects[i];
          }
        }
      });
    }
  }

  
  selectCourse(id:any,s_name:AnalyserNode) {
    this._router.navigate([`/chapters/${id}/${s_name}`]);

  }
  ngOnDestroy() {
  }

}
