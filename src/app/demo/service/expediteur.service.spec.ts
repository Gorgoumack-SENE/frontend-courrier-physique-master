import { TestBed } from '@angular/core/testing';

import { ExpediteurService } from './expediteur.service';

describe('ExpediteurService', () => {
  let service: ExpediteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpediteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
