import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canciones } from './canciones';

describe('Canciones', () => {
  let component: Canciones;
  let fixture: ComponentFixture<Canciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Canciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
