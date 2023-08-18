import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceDetailsComponent } from './interface-details.component';

describe('InterfaceDetailsComponent', () => {
  let component: InterfaceDetailsComponent;
  let fixture: ComponentFixture<InterfaceDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterfaceDetailsComponent]
    });
    fixture = TestBed.createComponent(InterfaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
