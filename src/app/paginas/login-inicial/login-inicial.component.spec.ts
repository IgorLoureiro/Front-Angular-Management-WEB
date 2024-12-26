import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInicialComponent } from './login-inicial.component';

describe('LoginInicialComponent', () => {
  let component: LoginInicialComponent;
  let fixture: ComponentFixture<LoginInicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginInicialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
