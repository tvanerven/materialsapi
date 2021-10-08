import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialsBrowserApiService<T> {

  private baseApiWithSlash: string | undefined;
  private readonly parameters = { withCredentials: true };

  constructor(
    private httpClient: HttpClient,
    private envService: EnvironmentService
  ) { }

  get baseApiUrl(): string {
    const envUrl = this.envService.environment.apiUrl;
    if (this.baseApiWithSlash == null) {
      this.baseApiWithSlash = (envUrl.slice(-1) !== '/') ? envUrl + '/' : envUrl;
    }
    return this.baseApiWithSlash;
  }

  private get showLog(): boolean {
    return this.envService.environment.log;
  }

  getAll(path: string, post = false, body?: unknown): Observable<T[]> {
    const url: string = this.baseApiUrl + path;
    this.printLog('[GET] On API service using url : ' + url);
    if (post) {
      return this.httpClient.post<T[]>(url, body, this.parameters);
    } else {
      return this.httpClient.get<T[]>(url, this.parameters);
    }
  }

  printLog(logMessage: string): void {
    if (this.showLog) {
      console.log(logMessage);
    }
  }

  handleError(httpError: HttpErrorResponse): Observable<never> {
    return throwError(httpError);
  }
}
