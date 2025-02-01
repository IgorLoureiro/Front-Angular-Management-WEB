import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  UserImage: string = "assets/veterinarian.png";
  Username: string = "UsuarioTeste";

  constructor(){

  }

  

}
