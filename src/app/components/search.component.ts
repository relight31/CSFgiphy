import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { GiphyService } from '../services/giphy.service';
import { Search } from './models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private giphySvc: GiphyService) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      apiKey: this.fb.control<string>(this.getApiKey(), [Validators.required]),
      query: this.fb.control('', [Validators.required]),
      limit: this.fb.control<string>('5'),
      rating: this.fb.control('r'),
    });
  }

  processForm() {
    const results = this.form.value as Search;
    console.log(results);
    this.createForm();
    this.giphySvc
      .search(results)
      .then((result) => {
        console.info(result);
        this.saveApiKey(results.apiKey);
        this.giphySvc.onNewSearch.next(result)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private getApiKey(): string {
    let key = localStorage.getItem('apiKey');
    if (!key) {
      return '';
    } else {
      return key;
    }
  }
  private saveApiKey(key: string) {
    localStorage.setItem('apiKey', key);
  }
}
