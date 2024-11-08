import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMonedaComponent } from './registrar-moneda.component';

describe('RegistrarMonedaComponent', () => {
  let component: RegistrarMonedaComponent;
  let fixture: ComponentFixture<RegistrarMonedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarMonedaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarMonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
