import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Environment {
  apiUrl: string;
  platform: string;
  log: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private appEnv: Environment | undefined;

  constructor(
    private httpClient: HttpClient
  ) { }

  loadEnvironment(): Promise<void> {
    return this.httpClient.get<Environment>('assets/environment.json')
      .toPromise()
      .then(env => { this.appEnv = env; });
  }

  get environment(): Environment {
    if (this.appEnv == null) {
      throw Error('Config file not loaded!');
    }
    return this.appEnv;
  }
}
