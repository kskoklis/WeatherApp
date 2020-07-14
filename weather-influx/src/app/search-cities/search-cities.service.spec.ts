import { TestBed } from '@angular/core/testing';

import { SearchCitiesService } from './search-cities.service';

describe('SearchCitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchCitiesService = TestBed.get(SearchCitiesService);
    expect(service).toBeTruthy();
  });
});
