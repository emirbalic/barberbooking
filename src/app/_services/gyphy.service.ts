import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GyphyService  {

  baseUrl: string = 'http://api.giphy.com/v1/gifs/search';
  apiKey: string = 'KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI';
  query: string = 'barber';
  giphy: any = {};

  constructor(private http: HttpClient) { }
  
  getGyphy() {
    return this.http.get(`${this.baseUrl}?api_key=${this.apiKey}&limit=100&q=${this.query}`)
    .pipe(
      map(giphy => {
        this.giphy = giphy;
        return giphy;
      })
    ) 
  }
}
