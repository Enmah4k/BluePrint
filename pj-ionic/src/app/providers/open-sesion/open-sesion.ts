import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class OpenSesionProvider {

  constructor(public http: HttpClient) {
    
  }

}
