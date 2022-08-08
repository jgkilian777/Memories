import { TestBed } from '@angular/core/testing';

import { CreateMemoryService } from './create-memory.service';

describe('CreateMemoryService', () => {
  let service: CreateMemoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateMemoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
