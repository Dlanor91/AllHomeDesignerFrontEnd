import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesVentasComponent } from './detalles-ventas.component';

describe('DetallesVentasComponent', () => {
  let component: DetallesVentasComponent;
  let fixture: ComponentFixture<DetallesVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
