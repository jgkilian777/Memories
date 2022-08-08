import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserGroupModalComponent } from './create-user-group-modal.component';

describe('CreateUserGroupModalComponent', () => {
  let component: CreateUserGroupModalComponent;
  let fixture: ComponentFixture<CreateUserGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserGroupModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUserGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
