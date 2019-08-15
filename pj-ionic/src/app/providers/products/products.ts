import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OdooJsonRpc } from '../../services/odoojsonrpc';

@Injectable()
export class ProductsProvider {
  
  product:Product[] =[];
  models: string = "product.product";

  constructor(public http: HttpClient, private odooServ: OdooJsonRpc) {
    
  }

  searchProduct()
  {
    this.odooServ.searchRead(this.models,[],[],0,0,"").then((resp: any) =>{
      this.setProduct(resp)
  
    }).catch((err)=>{
      console.log("error")
      console.log(err)

    })
  }

  setProduct(resp)
  {  
    console.log("voy por aqui")
    let json = JSON.parse(resp._body);
    if (!json.error) {
      let query = json["result"].records;

      for (let i in query) {
        this.product.push({
          id: query[i].id,
          name: query[i].name
        });
        console.log(query[i].name);
      }
    }

  }

}

export interface Product {
  id: string;
  name?: string;
  price?: string;
  category?: string;
  type?: string;
  barcode?: string;
  default_code?: string;
  uom_id?: string;
  taxes_id?: number;

} 

