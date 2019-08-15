
import { Injectable } from '@angular/core';
 

@Injectable()
export class PosProvider {
  public allProduct: Array<{
    id?: number;
    name?: string;
    qty?: any;
    price: Float32Array;
    id_product: number;
    category: string;
    position?: any;
    tax: any;
  }> = [];

  public tax: Array<{
    id?: number;
    name?: string;
    amount?: any;
    id_odoo?: number;
  }> = [];

  public productSelect: Array<{
    id?: number;
    name?: string;
    qty?: any;
    price: Float32Array;
    id_product: number;
    total?:any;
    position:number;
    tax: string,
    total_tax: any;
  }> = [];

  public searchProduct: Array<{
    id?: number;
    name?: string;
    qty?: any;
    price: Float32Array;
    id_product: number;
    category: string;
  }> = [];

  public AccountJournal: Array<{
    id?: number;
    name?: string;
    code?: string;
    type: string;
  }> = [];
  public customerName:string = "";
  public customerId:string


  public itbis: any = 0;
  public total = 0;
  
  constructor() {
  }

}
