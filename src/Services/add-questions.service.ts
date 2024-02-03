import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddQuestionsService {

  baseUrl = environment.apiUrl;
  
  constructor(private _http: HttpClient) { }

  getBoards(){
    return this._http.get<Response>(this.baseUrl + `getQuestion`);
  }
  getClasses(board_id:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?board_id=${board_id}`);
  }
  getSubjects(class_id:any){
    return this._http.get<Response>(this.baseUrl + `getSubject/${class_id}`);
  }
  getSubjectParts(subject_id:any, name:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&subject_id=${subject_id}`);
  }
  getChapters(part_id:any, name:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&part_id=${part_id}`);
  }
  createQuestion(question:any){
    return this._http.post<Response>(this.baseUrl + `createQuestion`, question);
  }
}
