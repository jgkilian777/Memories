import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemoryToUsergroupComponent } from './add-memory-to-usergroup.component';

describe('AddMemoryToUsergroupComponent', () => {
  let component: AddMemoryToUsergroupComponent;
  let fixture: ComponentFixture<AddMemoryToUsergroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMemoryToUsergroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemoryToUsergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
