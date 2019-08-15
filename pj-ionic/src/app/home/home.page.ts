import { Component } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  url: string = 'https://www.youtube.com/results?search_query=';

  id: number = 0;

  nombre: string = '';
  telefono: string = '';
  direccion: string = '';
  // direccion: {
  //   calle: string;
  //   numero_ap: number;
  //   sector: string;
  //   ciudad: string;
  //   zip_code: number;
  //   pais: string;
  // }
  longitud: number = 0;
  latitud: number = 0;

  url_qr: string = '_empty';

  constructor() {
    // this.url = 'https://www.youtube.com/results?search_query=';
    // this.id = 0;
    // this.nombre = 'Central';
    // this.telefono = '8095555555';
    // // this.direccion.calle = 'calle2';
    // // this.direccion.numero_ap = 12;
    // // this.direccion.sector = 'sector';
    // // this.direccion.ciudad = 'ciudad';
    // // this.direccion.zip_code = 42000;
    // // this.direccion.pais = 'pais';
    // this.direccion = 'calle-#12-sector-ciuddad-42000-pais';
    // this.longitud = -400;
    // this.latitud = 500;
    // this.url_qr = '';
  }

  generarQR(){

    let url = this.url;
    let id = this.id;
    let nom = this.nombre;
    let tel =this.telefono;
    let dir = this.direccion;
    let lat = this.latitud;
    let lon = this.longitud;

    this.url_qr = '' + url +'+'+ id +'+'+ nom +'+'+ tel +'+'+ dir +'+'+ lat +'+'+ lon + '';
  }
}