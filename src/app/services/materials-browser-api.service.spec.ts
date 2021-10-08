import { TestBed } from '@angular/core/testing';

import { MaterialsBrowserApiService } from './materials-browser-api.service';

describe('MaterialsBrowserApiService', () => {
  let service: MaterialsBrowserApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialsBrowserApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
