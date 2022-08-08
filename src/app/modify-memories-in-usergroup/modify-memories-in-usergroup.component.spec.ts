import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMemoriesInUsergroupComponent } from './modify-memories-in-usergroup.component';

describe('ModifyMemoriesInUsergroupComponent', () => {
  let component: ModifyMemoriesInUsergroupComponent;
  let fixture: ComponentFixture<ModifyMemoriesInUsergroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyMemoriesInUsergroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyMemoriesInUsergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
