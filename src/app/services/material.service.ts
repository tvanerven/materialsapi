
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Material } from '../models/material';
import { MaterialsBrowserApiService } from './materials-browser-api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  readonly baseUrl = 'material';

  constructor(
    private materialsBrowserApi: MaterialsBrowserApiService<Material>
  ) { }

  getMaterials(rdfAboutConceptFilter: string[]): Observable<Material[]> {
    return this.materialsBrowserApi.getAll(this.baseUrl, true, { rdfAboutConceptFilter })
      .pipe(map(materials => materials.map(material => {
        material.date = new Date(material.date);
        return material;
      })),
        catchError(this.materialsBrowserApi.handleError));
  }
}
