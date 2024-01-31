import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.apiUrl;
  
  resultData = {
    
  }

  constructor(private _http: HttpClient) { 
  
  }
  loginUser(model:any){
    return this._http.post<Response>(this.baseUrl + `api/users/login`, model);
  }
  getSubject(id:any){
    return this._http.get<Response>(this.baseUrl + `getSubject/${id}`);
  }
  getSubjectParts(subject_id: any, name: any) {
    return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&subject_id=${subject_id}`);
  }
  getChapters(part_id: any, name: any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&part_id=${part_id}`);
  }
  getQuestions(name:any, chapter_id:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&chapter_id=${chapter_id}`);
  }
  getResult(model:any){
    return this._http.post<Response>(this.baseUrl + `result`,model);
  }
}
