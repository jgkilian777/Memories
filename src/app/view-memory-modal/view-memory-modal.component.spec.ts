import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMemoryModalComponent } from './view-memory-modal.component';

describe('ViewMemoryModalComponent', () => {
  let component: ViewMemoryModalComponent;
  let fixture: ComponentFixture<ViewMemoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMemoryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMemoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
