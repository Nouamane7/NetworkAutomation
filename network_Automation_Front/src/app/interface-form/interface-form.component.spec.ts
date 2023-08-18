import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceFormComponent } from './interface-form.component';

describe('InterfaceFormComponent', () => {
  let component: InterfaceFormComponent;
  let fixture: ComponentFixture<InterfaceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterfaceFormComponent]
    });
    fixture = TestBed.createComponent(InterfaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
