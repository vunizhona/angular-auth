import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface Quote {
  _id: string;
  content: string;
  createdAt: Date;
  user: string; // id of the user who created the quote
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient) { }

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>('http://localhost:3000/user/quotes');
  }

  addQuote(content: string){
    return this.http.post<{ quote: Quote }>('http://localhost:3000/user/quotes', {content});
  }
}
