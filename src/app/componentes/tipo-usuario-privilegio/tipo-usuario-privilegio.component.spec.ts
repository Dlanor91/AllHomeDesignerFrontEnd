import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoUsuarioPrivilegioComponent } from './tipo-usuario-privilegio.component';

describe('TipoUsuarioPrivilegioComponent', () => {
  let component: TipoUsuarioPrivilegioComponent;
  let fixture: ComponentFixture<TipoUsuarioPrivilegioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoUsuarioPrivilegioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoUsuarioPrivilegioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
