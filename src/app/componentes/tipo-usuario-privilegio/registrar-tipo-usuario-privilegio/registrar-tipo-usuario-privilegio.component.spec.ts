import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTipoUsuarioPrivilegioComponent } from './registrar-tipo-usuario-privilegio.component';

describe('RegistrarTipoUsuarioPrivilegioComponent', () => {
  let component: RegistrarTipoUsuarioPrivilegioComponent;
  let fixture: ComponentFixture<RegistrarTipoUsuarioPrivilegioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarTipoUsuarioPrivilegioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarTipoUsuarioPrivilegioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
