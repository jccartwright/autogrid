import { TestBed, inject } from '@angular/core/testing';

import { AutogridService } from './autogrid.service';

describe('AutogridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutogridService]
    });
  });

  it('should be created', inject([AutogridService], (service: AutogridService) => {
    expect(service).toBeTruthy();
  }));
});
