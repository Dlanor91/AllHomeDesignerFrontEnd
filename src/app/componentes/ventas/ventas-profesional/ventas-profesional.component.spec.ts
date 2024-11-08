import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProfesionalComponent } from './ventas-profesional.component';

describe('VentasProfesionalComponent', () => {
  let component: VentasProfesionalComponent;
  let fixture: ComponentFixture<VentasProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasProfesionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
