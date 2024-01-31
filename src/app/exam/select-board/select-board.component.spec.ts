import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBoardComponent } from './select-board.component';

describe('SelectBoardComponent', () => {
  let component: SelectBoardComponent;
  let fixture: ComponentFixture<SelectBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBoardComponent]
    });
    fixture = TestBed.createComponent(SelectBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
