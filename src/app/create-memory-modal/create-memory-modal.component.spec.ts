import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMemoryModalComponent } from './create-memory-modal.component';

describe('CreateMemoryModalComponent', () => {
  let component: CreateMemoryModalComponent;
  let fixture: ComponentFixture<CreateMemoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMemoryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMemoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
