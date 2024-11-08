import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTrabajadoresFilialComponent } from './listar-trabajadores-filial.component';

describe('ListarTrabajadoresFilialComponent', () => {
  let component: ListarTrabajadoresFilialComponent;
  let fixture: ComponentFixture<ListarTrabajadoresFilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarTrabajadoresFilialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarTrabajadoresFilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
