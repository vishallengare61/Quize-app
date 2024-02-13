import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddQuestionsService {

  baseUrl = environment.apiUrl;
  token: string | null = null;

  constructor(private _http: HttpClient) { 
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const parsedData = JSON.parse(userData);
      this.token = parsedData.user.token;
    }
  }

  private createHeaders(): HttpHeaders {
    if (!this.token) {
      throw new Error('Token is not available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }
  
  getBoards(){
    return this._http.get<Response>(this.baseUrl + `getQuestion`, { headers: this.createHeaders() });
  }
  getClasses(board_id:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?board_id=${board_id}`, { headers: this.createHeaders() });
  }
  getSubjects(class_id:any){
    return this._http.get<Response>(this.baseUrl + `getSubject/${class_id}`, { headers: this.createHeaders() });
  }
  getSubjectParts(subject_id:any, name:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&subject_id=${subject_id}`, { headers: this.createHeaders() });
  }
  getChapters(part_id:any, name:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&part_id=${part_id}`, { headers: this.createHeaders() });
  }
  createQuestion(question:any){
    return this._http.post<Response>(this.baseUrl + `createQuestion`, question, { headers: this.createHeaders() });
  }
}
