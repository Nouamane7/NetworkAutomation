import { TestBed } from '@angular/core/testing';

import { ProtocolsControllerService } from './protocols-controller.service';

describe('ProtocolsControllerService', () => {
  let service: ProtocolsControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtocolsControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
