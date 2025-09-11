import { TestBed } from '@angular/core/testing';

import { ItmsRedirectService } from './itms-redirect.service';

describe('ItmsRedirectService', () => {
  let service: ItmsRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItmsRedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
