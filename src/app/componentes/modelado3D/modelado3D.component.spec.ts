import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modelado3DComponent } from './modelado3-d.component';

describe('Modelado3DComponent', () => {
  let component: Modelado3DComponent;
  let fixture: ComponentFixture<Modelado3DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Modelado3DComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modelado3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
