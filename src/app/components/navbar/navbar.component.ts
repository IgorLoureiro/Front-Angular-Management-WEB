import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import L from 'leaflet';

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
  @Output() addingPointer = new EventEmitter<string>();

  constructor(private el: ElementRef){

  }

  AddAPointer(localName: string){
    document.body.style.cursor = 'url("https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png") 16 32, auto';
    this.addingPointer.emit(localName);
  }

}
