import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
declare const L: any;

@Component({
  selector: 'app-tela-principal',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './tela-principal.component.html',
  styleUrl: './tela-principal.component.css'
})
export class TelaPrincipalComponent {

userLatitude!: number
userLongitude!: number
error!: string


ngOnInit() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
        console.log(this.userLatitude)
        console.log(this.userLongitude)
        console.log(position.coords.accuracy)

        let map = L.map('map').setView([this.userLatitude, this.userLongitude], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var marker = L.marker([this.userLatitude, this.userLongitude]).addTo(map);
        marker.bindPopup("<b>Você está aqui</b><br>Sua localização").openPopup();
      },
      (err) => {
        this.error = 'Erro ao obter localização: ' + err.message;
      },
      { enableHighAccuracy: true,
        timeout: 30000,          
        maximumAge: 0
       }
    );
  } else {
    this.error = 'Geolocalização não é suportada pelo navegador.';
  }
}


}
