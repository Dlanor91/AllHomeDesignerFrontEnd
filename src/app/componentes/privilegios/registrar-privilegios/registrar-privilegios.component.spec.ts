import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPrivilegiosComponent } from './registrar-privilegios.component';

describe('RegistrarPrivilegiosComponent', () => {
  let component: RegistrarPrivilegiosComponent;
  let fixture: ComponentFixture<RegistrarPrivilegiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarPrivilegiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPrivilegiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
