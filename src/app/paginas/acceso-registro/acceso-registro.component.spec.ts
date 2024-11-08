import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoRegistroComponent } from './acceso-registro.component';

describe('AccesoRegistroComponent', () => {
  let component: AccesoRegistroComponent;
  let fixture: ComponentFixture<AccesoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesoRegistroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
