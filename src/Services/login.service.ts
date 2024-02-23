import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;
  private token: string | null = null; // Initialize token as null
  resultData = {
    
  }
  constructor(private _http: HttpClient) {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const parsedData = JSON.parse(userData);
      this.token = parsedData.user.token;
    }
  }

  loginUser(model: any) {
    return this._http.post<Response>(`${this.baseUrl}api/users/login`, model);
  }

  getSubject(id: any){
    return this._http.get<Response>(this.baseUrl + `getSubject/${id}`);
  }

  getSubjectParts(subject_id: any, name: any) {
    return this._http.get(`${this.baseUrl}getQuestion/?name=${name}&subject_id=${subject_id}`);
  }

  getChapters(part_id: any, name: any) {
    return this._http.get(`${this.baseUrl}getQuestion/?name=${name}&part_id=${part_id}`);
  }

  getQuestions(name: any, chapter_id: any, class_id: any) {
    return this._http.get(`${this.baseUrl}getQuestion/?name=${name}&chapter_id=${chapter_id}&class_ki_id=${class_id}`);
  }

  getMixQuestions(model:any) {
    return this._http.post(`${this.baseUrl}createstagequiz`, model);
  }

  getResult(model: any) {
    return this._http.post(`${this.baseUrl}result`, model);
  }
}
