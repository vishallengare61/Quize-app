import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixTestDetailsComponent } from './mix-test-details.component';

describe('MixTestDetailsComponent', () => {
  let component: MixTestDetailsComponent;
  let fixture: ComponentFixture<MixTestDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MixTestDetailsComponent]
    });
    fixture = TestBed.createComponent(MixTestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
