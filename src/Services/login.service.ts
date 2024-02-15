
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {

//   baseUrl = environment.apiUrl;
//   token: string | null = null;
//   resultData = {
    
//   }
//   constructor(private _http: HttpClient) {
//     const userData = localStorage.getItem('user');
//     if (userData !== null) {
//       const parsedData = JSON.parse(userData);
//       this.token = parsedData.user.token;
//     }
//   }

//   private createHeaders(): HttpHeaders {
//     if (!this.token) {
//       throw new Error('Token is not available');
//     }
//     return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//   }

//   loginUser(model: any) {
//     return this._http.post<Response>(`${this.baseUrl}api/users/login`, model);
//   }

//   getSubject(id: any) {
//     return this._http.get<Response>(`${this.baseUrl}getSubject/${id}`, { headers: this.createHeaders() });
//   }

//   getSubjectParts(subject_id: any, name: any) {
//     return this._http.get<Response>(`${this.baseUrl}getQuestion/?name=${name}&subject_id=${subject_id}`, { headers: this.createHeaders() });
//   }

//   getChapters(part_id: any, name: any) {
//     return this._http.get<Response>(`${this.baseUrl}getQuestion/?name=${name}&part_id=${part_id}`, { headers: this.createHeaders() });
//   }

//   getQuestions(name: any, chapter_id: any, class_id: any) {
//     return this._http.get<Response>(`${this.baseUrl}getQuestion/?name=${name}&chapter_id=${chapter_id}&class_ki_id=${class_id}`, { headers: this.createHeaders() });
//   }

//   getResult(model: any) {
//     return this._http.post<Response>(`${this.baseUrl}result`, model, { headers: this.createHeaders() });
//   }
// }

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

    resultData = {
    
  }

  constructor(private _http: HttpClient) {
    this.initializeToken();
  }

  private initializeToken(): void {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const parsedData = JSON.parse(userData);
      this.tokenSubject.next(parsedData.user.token);
    }
  }

  private getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  private createHeaders(token: string): HttpHeaders {
    if (!token) {
      throw new Error('Token is not available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private getTokenAndCallApi(url: string, method: string, body?: any): Observable<any> {
    return this.getToken().pipe(
      switchMap((token: any) => {
        const headers = this.createHeaders(token);
        let options: any = { headers };
        
        if (body) {
          options.body = body;
        }
  
        return this._http.request(method, url, options);
      })
    );
  }
  

  loginUser(model: any) {
    return this._http.post<Response>(`${this.baseUrl}api/users/login`, model);
  }

  getSubject(id: any) {
    return this.getTokenAndCallApi(`${this.baseUrl}getSubject/${id}`, 'GET');
  }

  getSubjectParts(subject_id: any, name: any) {
    return this.getTokenAndCallApi(`${this.baseUrl}getQuestion/?name=${name}&subject_id=${subject_id}`, 'GET');
  }

  getChapters(part_id: any, name: any) {
    return this.getTokenAndCallApi(`${this.baseUrl}getQuestion/?name=${name}&part_id=${part_id}`,'GET');
  }

  getQuestions(name: any, chapter_id: any, class_id: any) {
    return this.getTokenAndCallApi(`${this.baseUrl}getQuestion/?name=${name}&chapter_id=${chapter_id}&class_ki_id=${class_id}`, 'GET');
  }
  // getMixQuestions(part_id: any, q_count: any) {
  //   return this.getTokenAndCallApi(`${this.baseUrl}getQuestion/?name=${part_id}&chapter_id=${q_count}`, 'GET');
  // }

  getMixQuestions(model:any) {
    return this.getTokenAndCallApi(`${this.baseUrl}createstagequiz`, 'POST',model);
  }

  getResult(model: any) {
    return this.getTokenAndCallApi(`${this.baseUrl}result`, 'POST', model);
  }
  
}
