import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentHistoryService {

  baseUrl = environment.apiUrl;
  token: string | null = null;


  constructor(private _httpClient: HttpClient) { 
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
  
  getAllHistory(){
    return this._httpClient.post(`${this.baseUrl}getquizdetails`,'', { headers: this.createHeaders() });
  }

  getQuizeResult(quizeID:any ){
    const quizpool_id = { quizpool_id: quizeID, reports:true };
    return this._httpClient.post(`${this.baseUrl}getquizdetails`,quizpool_id, { headers: this.createHeaders() });
  }

  getQuizeHistory(quizpool_id: any) {
    const body = { quizpool_id: quizpool_id }; // Construct the request body
    return this._httpClient.post(`${this.baseUrl}getquizdetails`, body, { headers: this.createHeaders() });
  }
  

}
