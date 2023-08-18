import { TestBed } from '@angular/core/testing';

import { InterfaceControllerService } from './interface-controller.service';

describe('InterfaceControllerService', () => {
  let service: InterfaceControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterfaceControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
