// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService implements OnInit {

//   baseUrl = environment.apiUrl;
//   getLocalstorageData: any;


//   resultData = {
    
//   }

//   parseUserData:any;
//   token: any;

//   constructor(private _http: HttpClient) { 
//    this.parseUserData = localStorage.getItem('user');
//     if (this.parseUserData!=  null) {
//       const parseData = JSON.parse(this.parseUserData);
//       this.token = parseData.user.token;
//       console.log('getting the token ------', this.token);
//     }
//   }
//   ngOnInit(){
    
//   }

  
//   loginUser(model:any){
//     return this._http.post<Response>(this.baseUrl + `api/users/login`, model);
//   }
//   getSubject(id: any) {
//     if (!this.token) {
//       throw new Error('Token is not available');
//     }
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     return this._http.get<Response>(`${this.baseUrl}getSubject/${id}`, { headers });
//   }
//   getSubjectParts(subject_id: any, name: any) {
//     if (!this.token) {
//       throw new Error('Token is not available');
//     }
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&subject_id=${subject_id}` , { headers });
//   }
//   getChapters(part_id: any, name: any){
//     if (!this.token) {
//       throw new Error('Token is not available');
//     }
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&part_id=${part_id}`, { headers });
//   }
//   getQuestions(name:any, chapter_id:any, class_id:any){
//     if (!this.token) {
//       throw new Error('Token is not available');
//     }
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     return this._http.get<Response>(this.baseUrl + `getQuestion/?name=${name}&chapter_id=${chapter_id}&class_ki_id=${class_id}`, { headers });
//   }
//   getResult(model:any){
//     if (!this.token) {
//       throw new Error('Token is not available');
//     }
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//     return this._http.post<Response>(this.baseUrl + `result`, model, { headers });
//   }
// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = environment.apiUrl;
  token: string | null = null;
  resultData = {
    
  }
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

  loginUser(model: any) {
    return this._http.post<Response>(`${this.baseUrl}api/users/login`, model);
  }

  getSubject(id: any) {
    return this._http.get<Response>(`${this.baseUrl}getSubject/${id}`, { headers: this.createHeaders() });
  }

  getSubjectParts(subject_id: any, name: any) {
    return this._http.get<Response>(`${this.baseUrl}getQuestion/?name=${name}&subject_id=${subject_id}`, { headers: this.createHeaders() });
  }

  getChapters(part_id: any, name: any) {
    return this._http.get<Response>(`${this.baseUrl}getQuestion/?name=${name}&part_id=${part_id}`, { headers: this.createHeaders() });
  }

  getQuestions(name: any, chapter_id: any, class_id: any) {
    return this._http.get<Response>(`${this.baseUrl}getQuestion/?name=${name}&chapter_id=${chapter_id}&class_ki_id=${class_id}`, { headers: this.createHeaders() });
  }

  getResult(model: any) {
    return this._http.post<Response>(`${this.baseUrl}result`, model, { headers: this.createHeaders() });
  }
}
