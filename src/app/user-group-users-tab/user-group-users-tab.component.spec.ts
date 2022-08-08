import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupUsersTabComponent } from './user-group-users-tab.component';

describe('UserGroupUsersTabComponent', () => {
  let component: UserGroupUsersTabComponent;
  let fixture: ComponentFixture<UserGroupUsersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupUsersTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGroupUsersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
