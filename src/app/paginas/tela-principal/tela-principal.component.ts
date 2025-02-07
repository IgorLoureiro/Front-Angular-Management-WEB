import { Component, HostListener, Inject, Input, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import * as L from 'leaflet';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-tela-principal',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './tela-principal.component.html',
  styleUrl: './tela-principal.component.css'
})
export class TelaPrincipalComponent {

  private map!: any;
  userLatitude!: number;
  userLongitude!: number;
  error!: string;
  isAddingPointer: boolean = false;
  isBrowser: boolean;
  showModal: boolean = true;
  PlaceName: string = "";

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      const L = await import('leaflet');

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLatitude = position.coords.latitude;
            this.userLongitude = position.coords.longitude;

            this.map = L.map('map', {
              dragging: true,
              doubleClickZoom: true,
            }).setView([this.userLatitude, this.userLongitude], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            var marker = L.marker([this.userLatitude, this.userLongitude]).addTo(this.map);
            marker.bindPopup("<b>Você está aqui</b><br>Sua localização").openPopup();
          },
          (err) => {
            this.error = 'Erro ao obter localização: ' + err.message;
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
        );
      } else {
        this.error = 'Geolocalização não é suportada pelo navegador.';
      }
    }
  }

  onAddingPointer($event: string) {
    this.PlaceName = $event
    this.map.dragging.disable();
    this.isAddingPointer = true;
  }

  @HostListener('document:click', ['$event'])
  addPointerInMap(event: MouseEvent){
    this.map.on('click', async (event: any) => {
      console.log('isAddingPointer', this.isAddingPointer)
      if(this.isAddingPointer){
        const L = await import('leaflet');
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;

        var marker = L.marker([lat, lng]).addTo(this.map);
        marker.bindPopup(`<b>${this.PlaceName}</b>`).openPopup();

        document.body.style.cursor = 'default';
        this.map.dragging.enable();
        this.isAddingPointer = false;
      }
    });
  }

}