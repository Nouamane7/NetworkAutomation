import { TestBed } from '@angular/core/testing';

import { DevicesControllerService } from './devices-controller.service';

describe('DevicesControllerService', () => {
  let service: DevicesControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicesControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
