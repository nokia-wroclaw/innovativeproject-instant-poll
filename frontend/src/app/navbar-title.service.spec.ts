import { TestBed } from '@angular/core/testing';

import { NavbarTitleService } from './navbar-title.service';

describe('NavbarTitleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavbarTitleService = TestBed.get(NavbarTitleService);
    expect(service).toBeTruthy();
  });
});
