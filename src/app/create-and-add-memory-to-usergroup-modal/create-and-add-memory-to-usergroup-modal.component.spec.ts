import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAndAddMemoryToUsergroupModalComponent } from './create-and-add-memory-to-usergroup-modal.component';

describe('CreateAndAddMemoryToUsergroupModalComponent', () => {
  let component: CreateAndAddMemoryToUsergroupModalComponent;
  let fixture: ComponentFixture<CreateAndAddMemoryToUsergroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAndAddMemoryToUsergroupModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAndAddMemoryToUsergroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
