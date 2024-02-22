
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private tokenInitialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    resultData = {
    
  }
  token:any;

  constructor(private _http: HttpClient) {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const parsedData = JSON.parse(userData);
      this.token = parsedData.user.token;
    }
    // this.initializeToken();
  }

   createHeaders(): HttpHeaders {
    if (!this.token) {
      throw new Error('Token is not available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  // private async initializeToken(): Promise<void> {
  //   const userData = localStorage.getItem('user');
  //   if (userData !== null) {
  //     const parsedData = JSON.parse(userData);
  //     this.tokenSubject.next(parsedData.user.token);
  //     this.tokenInitialized.next(true);
  //   } else {
  //     throw new Error('User data not found in localStorage');
  //   }
  // }

  private getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  // private createHeaders(token: string): HttpHeaders {
  //   if (!token) {
  //     throw new Error('Token is not available');
  //   }
  //   return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  // }

  // private getTokenAndCallApi(url: string, method: string, body?: any): Observable<any> {
  //   return this.tokenInitialized.pipe(
  //     switchMap(() => {
  //       return this.getToken().pipe(
  //         switchMap((token: any) => {
  //           const headers = this.createHeaders(token);
  //           let options: any = { headers };
  //           if (body) {
  //             options.body = body;
  //           }
  //           return this._http.request(method, url, options);
  //         })
  //       );
  //     })
  //   );
  // }

  loginUser(model: any) {
    return this._http.post<Response>(`${this.baseUrl}api/users/login`, model);
  }

  // getSubject(id: any) {
  //   return this.getTokenAndCallApi(`${this.baseUrl}getSubject/${id}`, 'GET');
  // }
  getSubject(id: any){
    return this._http.get<Response>(this.baseUrl + `getSubject/${id}`, { headers: this.createHeaders() });
  }

  // getSubjectParts(subject_id: any, name: any) {
  //   return this.getTokenAndCallApi(`${this.baseUrl}getQuestion/?name=${name}&subject_id=${subject_id}`, 'GET');
  // }
  getSubjectParts(subject_id: any, name: any) {
    return this._http.get(`${this.baseUrl}getQuestion/?name=${name}&subject_id=${subject_id}`,{ headers: this.createHeaders() });
  }

  // getChapters(part_id: any, name: any) {
  //   return this.getTokenAndCallApi(`${this.baseUrl}getQuestion/?name=${name}&part_id=${part_id}`,'GET');
  // }
  getChapters(part_id: any, name: any) {
    return this._http.get(`${this.baseUrl}getQuestion/?name=${name}&part_id=${part_id}`,{ headers: this.createHeaders() });
  }

  getQuestions(name: any, chapter_id: any, class_id: any) {
    return this._http.get(`${this.baseUrl}getQuestion/?name=${name}&chapter_id=${chapter_id}&class_ki_id=${class_id}`,{ headers: this.createHeaders() });
  }


  getMixQuestions(model:any) {
    return this._http.post(`${this.baseUrl}createstagequiz`,model, { headers: this.createHeaders() });
  }

  getResult(model: any) {
    return this._http.post(`${this.baseUrl}result`, model, { headers: this.createHeaders() });
  }
  
}
