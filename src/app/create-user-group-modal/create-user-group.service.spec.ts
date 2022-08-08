import { TestBed } from '@angular/core/testing';

import { CreateUserGroupService } from './create-user-group.service';

describe('CreateUserGroupService', () => {
  let service: CreateUserGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateUserGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
