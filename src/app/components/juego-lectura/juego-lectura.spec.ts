import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoLectura } from './juego-lectura';

describe('JuegoLectura', () => {
  let component: JuegoLectura;
  let fixture: ComponentFixture<JuegoLectura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuegoLectura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuegoLectura);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
