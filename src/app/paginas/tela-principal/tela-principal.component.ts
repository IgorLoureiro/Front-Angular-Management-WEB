import { Component, HostListener, Inject, Input, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import * as L from 'leaflet';
import { isPlatformBrowser, CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-tela-principal',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
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

  onAddingPointer($event: any) {
    if($event == true){
      this.map.dragging.disable();
      this.isAddingPointer = true;
    } else{
      this.map.dragging.enable();
      this.isAddingPointer = false;
    }
  }

  @HostListener('document:click', ['$event'])
  addPointerInMap(event: MouseEvent){
    this.map.on('click', async (event: any) => {
      if(this.isAddingPointer){
        const L = await import('leaflet');
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;

        this.openModal()

        // var marker = L.marker([lat, lng]).addTo(this.map);
        // marker.bindPopup("<b>Você clicou aqui</b>").openPopup();

        // document.body.style.cursor = 'default';
        // this.map.dragging.enable();
        // this.isAddingPointer = false;
      }
    });
  }

  openModal(){
    if (this.isBrowser) {
      const modalElement = document.getElementById('staticBackdrop');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement!);
        modal.show();
      }
    }
  }

}