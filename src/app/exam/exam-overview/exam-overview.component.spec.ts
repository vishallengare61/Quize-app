import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamOverviewComponent } from './exam-overview.component';

describe('ExamOverviewComponent', () => {
  let component: ExamOverviewComponent;
  let fixture: ComponentFixture<ExamOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamOverviewComponent]
    });
    fixture = TestBed.createComponent(ExamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
