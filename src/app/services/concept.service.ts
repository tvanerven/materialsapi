import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Concept } from '../common/concept';
import { MaterialsBrowserApiService } from './materials-browser-api.service';

@Injectable({
  providedIn: 'root'
})
export class ConceptService {

  readonly baseUrl = 'concept';

  constructor(
    private materialsBrowserApi: MaterialsBrowserApiService<Concept>
  ) { }

  getConcepts(): Observable<Concept[]> {
    return this.materialsBrowserApi.getAll(this.baseUrl)
      .pipe(catchError(this.materialsBrowserApi.handleError));
  }
}
