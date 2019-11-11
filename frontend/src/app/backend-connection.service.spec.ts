import { TestBed } from '@angular/core/testing';

import { BackendConnectionService } from './backend-connection.service';

describe('BackendConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackendConnectionService = TestBed.get(BackendConnectionService);
    expect(service).toBeTruthy();
  });
});
