import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUpdateFilialComponent } from './edit-update-filial.component';

describe('EditUpdateFilialComponent', () => {
  let component: EditUpdateFilialComponent;
  let fixture: ComponentFixture<EditUpdateFilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUpdateFilialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUpdateFilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
