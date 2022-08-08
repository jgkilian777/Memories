import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteUserToUserGroupModalComponent } from './invite-user-to-user-group-modal.component';

describe('InviteUserToUserGroupModalComponent', () => {
  let component: InviteUserToUserGroupModalComponent;
  let fixture: ComponentFixture<InviteUserToUserGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteUserToUserGroupModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteUserToUserGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
