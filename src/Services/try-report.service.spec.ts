import { TestBed } from '@angular/core/testing';

import { TryReportService } from './try-report.service';

describe('TryReportService', () => {
  let service: TryReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TryReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
