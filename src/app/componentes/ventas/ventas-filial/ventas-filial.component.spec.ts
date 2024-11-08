import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasFilialComponent } from './ventas-filial.component';

describe('VentasFilialComponent', () => {
  let component: VentasFilialComponent;
  let fixture: ComponentFixture<VentasFilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasFilialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasFilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
