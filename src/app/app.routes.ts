import { Routes } from '@angular/router';
import { LoginInicialComponent } from './paginas/login-inicial/login-inicial.component';
import { PasswordRecoveryComponent } from './paginas/password-recovery/password-recovery.component';
import { TelaPrincipalComponent } from './paginas/tela-principal/tela-principal.component';

export const routes: Routes = [
    {path: '', component: LoginInicialComponent},
    {path: 'password-recovery', component: PasswordRecoveryComponent},
    {path: 'tela-principal', component: TelaPrincipalComponent}
];
