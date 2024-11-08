import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAfiliadoComponent } from './listar-filiales.component';

describe('ListarAfiliadoComponent', () => {
  let component: ListarAfiliadoComponent;
  let fixture: ComponentFixture<ListarAfiliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarAfiliadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
