import { TestBed } from '@angular/core/testing';

import { CreateAndAddMemoryToUsergroupModalService } from './create-and-add-memory-to-usergroup-modal.service';

describe('CreateAndAddMemoryToUsergroupModalService', () => {
  let service: CreateAndAddMemoryToUsergroupModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAndAddMemoryToUsergroupModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
