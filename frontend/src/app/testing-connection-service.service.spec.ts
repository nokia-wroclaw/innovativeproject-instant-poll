import { TestBed } from '@angular/core/testing';

import { TestingConnectionServiceService } from './testing-connection-service.service';

describe('TestingConnectionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestingConnectionServiceService = TestBed.get(TestingConnectionServiceService);
    expect(service).toBeTruthy();
  });
});
