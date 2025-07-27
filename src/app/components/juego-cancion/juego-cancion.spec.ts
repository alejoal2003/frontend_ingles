import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoCancion } from './juego-cancion';

describe('JuegoCancion', () => {
  let component: JuegoCancion;
  let fixture: ComponentFixture<JuegoCancion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuegoCancion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuegoCancion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
