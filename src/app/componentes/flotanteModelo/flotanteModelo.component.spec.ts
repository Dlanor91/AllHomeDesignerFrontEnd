import { ComponentFixture, TestBed } from '@angular/core/testing';

import { flotanteModeloComponent } from './flotanteModelo.component';

describe('ModeloComponent', () => {
  let component: flotanteModeloComponent;
  let fixture: ComponentFixture<flotanteModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ flotanteModeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(flotanteModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
