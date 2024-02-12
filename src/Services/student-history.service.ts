import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentHistoryService {

  baseUrl = environment.apiUrl;

  constructor(private _httpClient: HttpClient) { }

  getAllHistory(){
    // return this._httpClient.get(``)
    // return this._http.post<Response>(`${this.baseUrl}api/users/login`, model);
  }

}
