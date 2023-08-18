import { TestBed } from '@angular/core/testing';

import { DeviceControllerService } from './device-controller.service';

describe('DeviceControllerService', () => {
  let service: DeviceControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
