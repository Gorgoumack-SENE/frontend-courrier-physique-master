import { TestBed } from '@angular/core/testing';

import { DestinataireService } from './destinataire.service';

describe('DestinataireService', () => {
  let service: DestinataireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinataireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
