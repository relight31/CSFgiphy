import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Search } from '../components/models';
import { firstValueFrom, map, Subject } from 'rxjs';

@Injectable()
export class GiphyService {
  onNewSearch = new Subject<string[]>();
  constructor(private http: HttpClient) {}

  search(criteria: Search): Promise<string[]> {
    //Construct query params
    const params = new HttpParams()
      .set('q', criteria.query)
      .set('limit', criteria.limit)
      .set('api_key', criteria.apiKey)
      .set('rating', criteria.rating)
      .set('offset', 0)
      .set('lang', 'en');
    return firstValueFrom(
      this.http
        .get<any>('https://api.giphy.com/v1/gifs/search', { params })
        .pipe(
          map((result) => {
            const data = result.data;
            return data.map((v: any) => {
              return v.images.fixed_height.url as string;
            });
          })
        )
    );
  }
}
