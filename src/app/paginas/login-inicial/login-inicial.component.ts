import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { LoginServiceService } from '../../Services/login-service.service';
import { stringify } from 'node:querystring';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login-inicial',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-inicial.component.html',
  styleUrl: './login-inicial.component.css'
})

export class LoginInicialComponent {

  LoginForm!: FormGroup;
  SignUpForm!: FormGroup;
  VerificationList: boolean[] = [false, false, false, false, false];
  DebouncePassword = new Subject<string>();
  SignUpModal: boolean = false;
  UserIsAlreadyTaken: boolean = false;
  EmailIsAlreadyRegistered: boolean = false;
  Modal: boolean = false;
  Message!: string;
  ModalTitle: string = '';
  ModalTitleColor: string = 'green';
  signUpMode: boolean = false;

  //Injeção e manuseio de dependencias (Método antigo)
  constructor(
    private FormBuilder: FormBuilder,
    private LoginService: LoginServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ){

  }

  ngOnInit(){
    this.LoginForm = this.FormBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      RememberMe: [true]      
    })
    this.DebouncePassword.pipe(debounceTime(300)).subscribe(() => {
      this.verifyRequisitesPassword();
    })
    this.isRemembered();
  }

  get IsPasswordValid(): boolean{
    return this.VerificationList.every(value => value === true);
  }

  SubmitLogin(){
    console.log(this.LoginForm.value)
    this.LoginService.PostLoginUser(this.LoginForm.value).subscribe({
      next: (result: any) => {
        if(this.LoginForm.controls['RememberMe'].value){
          let UserLoged = {
            LoginForm: this.LoginForm.value,
            DaysRemembered: 7,
            RememberedDate: new Date()
          }
          localStorage.setItem('UserLoged', JSON.stringify(UserLoged));
          this.router.navigate(['tela-principal']);
        }
        this.Modal = true
        this.ModalTitle = 'Success'
        this.ModalTitleColor = 'green'
        this.Message = result?.message
      }, error: (e) => {
        console.log(e)
        localStorage.removeItem('UserLoged');
        this.Message = e.error.message
        this.ModalTitleColor = 'red'
        this.ModalTitle = 'Error'
        this.Modal = true;
      }
    })
  }

  onClickRememberMe(){
    this.LoginForm.controls['RememberMe'].setValue(!this.LoginForm.controls['RememberMe'].value)
  }

  onSignUpDone(){
    this.UserIsAlreadyTaken = false;
    this.EmailIsAlreadyRegistered = false;
    this.LoginService.PostRegisterUser(this.SignUpForm.value).subscribe({
      next: (result: any) => {
        this.SignUpModal = !this.SignUpModal
        this.Message = result?.message;
        this.ModalTitle = 'Success';
        this.ModalTitleColor = 'green'
        this.Modal = true;
      }, error: (e) => {
        if(e?.error?.code == 1){
          this.UserIsAlreadyTaken = true;
        } else if(e?.error?.code == 2){
          this.EmailIsAlreadyRegistered = true;
        } else{
          this.SignUpModal = !this.SignUpModal
          this.ModalTitle = 'Error'
          this.ModalTitleColor = 'red'
          this.Message = e.error.message;
          this.Modal = true;
        }
      }
    })
  }

  verifyRequisitesPassword(){
    const password = this.LoginForm?.get('password')?.value
    this.VerificationList[0] = password.length >= 8;
    this.VerificationList[1] = /[A-Z]/.test(password)
    this.VerificationList[2] = /[a-z]/.test(password)
    this.VerificationList[3] = /\d/.test(password)
    this.VerificationList[4] = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  changeSignUpMode(){
    // this.SignUpForm.reset()
    this.UserIsAlreadyTaken = false;
    this.EmailIsAlreadyRegistered = false;
    this.signUpMode = !this.signUpMode;
    // this.SignUpModal = true;
    this.VerificationList = [false, false, false, false, false];
  }

  isRemembered(){
    if (isPlatformBrowser(this.platformId)) {
      let storedData = localStorage.getItem('UserLoged');
      let UserLogedData = storedData ? JSON.parse(storedData) : null;
  
      if (UserLogedData) {
        let NowDate = new Date();
        let RememberedDate = new Date(UserLogedData.RememberedDate);
  
        let DaysPassed = Math.floor((NowDate.getTime() - RememberedDate.getTime()) / (1000 * 60 * 60 * 24));
  
        UserLogedData.DaysRemembered = UserLogedData.DaysRemembered - DaysPassed;
  
        if(UserLogedData.DaysRemembered <= 0){
          localStorage.removeItem('UserLoged');
        } else{
          localStorage.setItem('UserLoged', JSON.stringify(UserLogedData));
        }
      }
    }
  }

  GoToPasswordRecovery(){
    this.router.navigate(['/password-recovery']);
  }

}
