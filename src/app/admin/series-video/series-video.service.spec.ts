import { TestBed } from '@angular/core/testing';

import { SeriesVideoService } from './series-video.service';

describe('SeriesVideoService', () => {
  let service: SeriesVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeriesVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
