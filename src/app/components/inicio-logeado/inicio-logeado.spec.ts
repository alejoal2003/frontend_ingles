import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioLogeado } from './inicio-logeado';

describe('InicioLogeado', () => {
  let component: InicioLogeado;
  let fixture: ComponentFixture<InicioLogeado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioLogeado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioLogeado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
