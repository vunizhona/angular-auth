import {Component, OnInit} from '@angular/core';
import {Quote, QuoteService} from "./quote.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css'
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] | undefined;
  newQuoteContent: string = '';

  constructor(private quotesService: QuoteService) {}

  onAddQuote() {
    if(this.newQuoteContent.trim() === ''){
      return;
    }
    if(this.newQuoteContent.trim()){
      this.quotesService.addQuote(this.newQuoteContent).subscribe(res => {
        console.log(res);
        this.quotes?.push(res?.quote.)
        this.newQuoteContent = '';
      })
    }
  }

  ngOnInit(): void {
    this.quotesService.getQuotes().subscribe(quotes => {
      console.log(quotes);
      this.quotes = quotes;
    })
  }
}
