import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoRegistroClienteComponent } from './acceso-registro-cliente.component';

describe('AccesoRegistroClienteComponent', () => {
  let component: AccesoRegistroClienteComponent;
  let fixture: ComponentFixture<AccesoRegistroClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesoRegistroClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoRegistroClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
