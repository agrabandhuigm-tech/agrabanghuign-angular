import { TestBed } from '@angular/core/testing';

import { PdfCheckService } from './pdf-check.service';

describe('PdfCheckService', () => {
  let service: PdfCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
