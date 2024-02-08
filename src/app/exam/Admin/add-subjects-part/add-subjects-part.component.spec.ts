import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectsPartComponent } from './add-subjects-part.component';

describe('AddSubjectsPartComponent', () => {
  let component: AddSubjectsPartComponent;
  let fixture: ComponentFixture<AddSubjectsPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubjectsPartComponent]
    });
    fixture = TestBed.createComponent(AddSubjectsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
