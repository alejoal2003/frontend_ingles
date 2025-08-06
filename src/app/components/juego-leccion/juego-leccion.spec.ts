import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoLeccion } from './juego-leccion';

describe('JuegoLeccion', () => {
  let component: JuegoLeccion;
  let fixture: ComponentFixture<JuegoLeccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuegoLeccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuegoLeccion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
