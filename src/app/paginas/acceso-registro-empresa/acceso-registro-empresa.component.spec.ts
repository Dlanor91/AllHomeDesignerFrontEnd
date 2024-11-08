import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoRegistroEmpresaComponent } from './acceso-registro-empresa.component';

describe('AccesoRegistroEmpresaComponent', () => {
  let component: AccesoRegistroEmpresaComponent;
  let fixture: ComponentFixture<AccesoRegistroEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesoRegistroEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoRegistroEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
