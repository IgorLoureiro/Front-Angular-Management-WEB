import { Component } from '@angular/core';
import { LoginServiceService } from '../../Services/login-service.service';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {

  SendEmailReport: string|null = null;
  SendedCode: boolean = false;
  SendCodeReport: string|null = null;
  EmailBackup!: string;
  VerificationList: boolean[] = [false, false, false, false, false];
  InputPassword: string = '';
  InputPasswordConfirm: string = '';
  InputCode: string = '';
  ReportTextColor: string = 'red';

  DebouncePassword = new Subject<string>();

  constructor(private LoginService: LoginServiceService,
    private router: Router
  ){
    
  }

  ngOnInit(){
    this.DebouncePassword.pipe(debounceTime(300)).subscribe((string) => {
      this.verifyRequisitesPassword(string);
    });
  }

  SendCode(email: string) {
    this.EmailBackup = email;
    this.SendEmailReport = null;
    this.LoginService.PostRecoverAccount(email).subscribe({
      next:(value: any) => {
        this.ReportTextColor = "green"
        this.SendEmailReport = "If the email is registered, a recovery code has been sent."
        setTimeout(() => {
          this.SendedCode = true;
        }, 4000);
      }, error: (e) => {
        console.log(e)
        this.ReportTextColor = "red"
        this.SendEmailReport = `${e.error.message}`;
      }
    })
  }

  verifyRequisitesPassword(password: string){
    this.VerificationList[0] = password.length >= 8;
    this.VerificationList[1] = /[A-Z]/.test(password)
    this.VerificationList[2] = /[a-z]/.test(password)
    this.VerificationList[3] = /\d/.test(password)
    this.VerificationList[4] = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  get IsPasswordValid(): boolean{
    return this.VerificationList.every(value => value === true);
  }

  VerifyCode(code: string, senha: string, confirmPassword: string){
    const body = {
      email: this.EmailBackup,
      code: code,
      password: senha,
      confirmPassword: confirmPassword
    }
    this.LoginService.PostVerifyCodeAndModifyPassword(body).subscribe({
      next:(value: any) => {
        this.ReportTextColor = "green"
        this.SendCodeReport = value.message;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000)
      }, error: (e: any) => {
        this.ReportTextColor = "red"
        this.SendCodeReport = e.error.message;
      }
    })
  }

}
