import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserMemoryModalComponent } from './view-user-memory-modal.component';

describe('ViewUserMemoryModalComponent', () => {
  let component: ViewUserMemoryModalComponent;
  let fixture: ComponentFixture<ViewUserMemoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserMemoryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserMemoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
