
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, filter, switchMap, take, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private tokenInitialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    resultData = {
    
  }

  constructor(private _http: HttpClient) {
    this.initializeToken().then(() => {
      console.log('Token initialized successfully');
    }).catch(error => {
      console.error('Error initializing token:', error);
    });
  }

  private async initializeToken(): Promise<void> {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const parsedData = JSON.parse(userData);
      this.tokenSubject.next(parsedData.user.token);
      this.tokenInitialized.next(true);
    } else {
      throw new Error('User data not found in localStorage');
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
        if (token !== null) {
          const headers = this.createHeaders(token);
          let options: any = { headers };
          if (body) {
            options.body = body;
          }
          return this._http.request(method, url, options);
        } else {
          return throwError(new Error('Token is not available')); // or handle the error as needed
        }
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

  getMixQuestions(model:any) {
    return this.getTokenAndCallApi(`${this.baseUrl}createstagequiz`, 'POST',model);
  }

  getResult(model: any) {
    return this.getTokenAndCallApi(`${this.baseUrl}result`, 'POST', model);
  }
  
}
