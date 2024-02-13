import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizeReportComponent } from './quize-report.component';

describe('QuizeReportComponent', () => {
  let component: QuizeReportComponent;
  let fixture: ComponentFixture<QuizeReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizeReportComponent]
    });
    fixture = TestBed.createComponent(QuizeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
