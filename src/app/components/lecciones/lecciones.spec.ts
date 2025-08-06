import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lecciones } from './lecciones';

describe('Lecciones', () => {
  let component: Lecciones;
  let fixture: ComponentFixture<Lecciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lecciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lecciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
