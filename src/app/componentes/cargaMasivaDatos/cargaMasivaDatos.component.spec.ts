import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMasivaDatosComponent } from './cargaMasivaDatos.component';

describe('CargaMasivaDatosComponent', () => {
  let component: CargaMasivaDatosComponent;
  let fixture: ComponentFixture<CargaMasivaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaMasivaDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaMasivaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
