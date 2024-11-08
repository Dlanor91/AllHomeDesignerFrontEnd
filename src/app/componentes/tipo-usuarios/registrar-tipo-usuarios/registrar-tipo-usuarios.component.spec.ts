import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTipoUsuariosComponent } from './registrar-tipo-usuarios.component';

describe('RegistrarTipoUsuariosComponent', () => {
  let component: RegistrarTipoUsuariosComponent;
  let fixture: ComponentFixture<RegistrarTipoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarTipoUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarTipoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
