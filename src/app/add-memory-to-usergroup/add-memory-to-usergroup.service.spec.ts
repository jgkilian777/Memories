import { TestBed } from '@angular/core/testing';

import { AddMemoryToUsergroupService } from './add-memory-to-usergroup.service';

describe('AddMemoryToUsergroupService', () => {
  let service: AddMemoryToUsergroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddMemoryToUsergroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
