import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasEmpresaComponent } from './ventas-empresa.component';

describe('VentasEmpresaComponent', () => {
  let component: VentasEmpresaComponent;
  let fixture: ComponentFixture<VentasEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
