import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrabajadoresComponent } from './edit-trabajadores.component';

describe('EditTrabajadoresComponent', () => {
  let component: EditTrabajadoresComponent;
  let fixture: ComponentFixture<EditTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTrabajadoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
