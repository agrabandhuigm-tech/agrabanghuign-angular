import { TestBed } from '@angular/core/testing';

import { ApiEssService } from './api-ess.service';

describe('ApiEssService', () => {
  let service: ApiEssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiEssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
