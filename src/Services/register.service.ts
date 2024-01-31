import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  baseUrl = environment.apiUrl;
  
  resultData = {
    
  }

  constructor(private _http: HttpClient) { 
  
  }
 
  getBoard(){
    return this._http.get<Response>(this.baseUrl + `getQuestion`);
  }

  getclassData(board_id:any){
    return this._http.get<Response>(this.baseUrl + `getQuestion/?board_id=${board_id}`);
  }

  registerUser(user:any){
    return this._http.post<Response>(this.baseUrl + `api/users/register`, user);
  }
}
