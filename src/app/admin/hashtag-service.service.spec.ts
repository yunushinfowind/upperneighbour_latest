import { TestBed } from '@angular/core/testing';

import { HashtagServiceService } from './account-service.service';

describe('HashtagServiceService', () => {
  let service: HashtagServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashtagServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
