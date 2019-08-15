import { Injectable } from "@angular/core";

import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
@Injectable()
export class DatabasesProvider {
  public db: SQLiteObject;
  public isOpen: boolean;
  public arraySession;
  public result: any[] = [];

  public parnet_id: string;
  
  public username: string;
  public pass: string;
  public db_odoo: string;
  public customers: Array<{
    name: string;
    address: string;
    phone: string;
    mobile: string;
    website: string;
    id_odoo: string;
    email: string;
  }> = [];

  public allReceipt: Array<{
    id?: string;
    id_session?: string;
    total?: number;
    fecha: string;
    payment_id: string;
    id_customer: string;
    name_customer: string;
    total_tax: string;
  }> = [];

  public productSelect: Array<{
    id?: number;
    name?: string;
    qty?: any;
    price: Float32Array;
    id_product: number;
    tax: string;
    id_receipt: number;
  }> = [];

  data: any[] = [];
  rowArgs = [];

  constructor(public storage: SQLite) {
    if (!this.isOpen) {
      this.storage = new SQLite();
      this.storage
        .create({ name: "neotec.db", location: "default" })
        .then((db: SQLiteObject) => {
          this.db = db;
          this.createSession()
            .then(() => {
              this.createRecibo()
                .then(() => {
                  this.createProduct()
                    .then(() => {
                      this.createProducts()
                        .then(() => {
                          this.createMethodPayment()
                            .then(() => {
                              this.createCustomers()
                                .then(() => {
                                  this.createAllTax().catch(err => {
                                    console.log(
                                      "Error al intentar crear la tabla impuestos " +
                                        JSON.stringify(err)
                                    );
                                  });
                                })

                                .catch(err => {
                                  console.log(
                                    "error al crear tabla customer" +
                                      JSON.stringify(err)
                                  );
                                });
                            })

                            .catch(err => {
                              console.log(
                                "no se creo la tabla method payment" +
                                  JSON.stringify(err)
                              );
                            });
                        })
                        .catch(err =>
                          console.log(
                            JSON.stringify(err) + "no se creo productos"
                          )
                        );
                    })
                    .catch(err =>
                      console.log(JSON.stringify(err) + "no se creo producto")
                    );
                })
                .catch(err =>
                  console.log(JSON.stringify(err) + "no se creo recibo")
                );
            })
            .catch(err =>
              console.log(JSON.stringify(err) + "no se creo session")
            );

          this.isOpen = true;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  //crear tablas en la base de datos

  createSession() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(
          `CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY AUTOINCREMENT,
        date_start DATE,  
        date_end DATE,
        is_open BOOLEAN,
        total FLOAT,
        user VARCHAR(32))
        `,
        
          []
        )
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }

  createRecibo() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(
          `CREATE TABLE IF NOT EXISTS receipt (id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_session INTEGER,  
        total FLOAT,
        fecha DATE,
        payment_id INTEGER,
        id_customer INTEGER,
        name_customer VARCHAR(32),
        total_tax FLOAT,
        sync BOOLEAN,
        user VARCHAR(32)
        )`,
          []
        )
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }
  createAllTax() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(
          `CREATE TABLE IF NOT EXISTS all_tax (id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_odoo INTEGER,  
        name VARCHAR(32),
        amount FLOAT,
        user VARCHAR(32)
        )`,
          []
        )
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }

  createMethodPayment() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(
          `CREATE TABLE IF NOT EXISTS method_payment (id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_odoo INTEGER,  
        name VARCHAR(32),
        code VARCHAR(32),
        type VARCHAR(32),
        user VARCHAR(32)
        )`,
          []
        )
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }

  createProduct() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(
          `CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(32),  
        precio FLOAT,
        cantidad INTEGER,
        id_producto INTEGER,
        id_recibo INTEGER,
        tax VARCHAR(32),
        user VARCHAR(32)
        )`,
          []
        )
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }

  createProducts() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(
          `CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(32), 
        categoria VARCHAR(32), 
        precio FLOAT,
        cantidad INTEGER,
        id_producto INTEGER,
        tax VARCHAR(32),
        user VARCHAR(32)
        )`,
          []
        )
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }

  createCustomers() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(
          `CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(32),  
        address VARCHAR(200),
        phone VARCHAR(15),
        mobile VARCHAR(15),
        website VARCHAR(50),
        id_odoo INTEGER,
        email VARCHAR(50),
        user VARCHAR(32)
        )`,

          []
        )
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }

  //consultas para abrir y cerrar session
  verifySession() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM session where is_open = 'true' AND user = ?", [this.username])
        .then(data => {
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              this.arraySession = data.rows.item(i).id;
            }
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  openSession(username) {
    return new Promise((resolve, reject) => {
      let sql = "insert into session VALUES(?,?,?,?,?,?)";
      let date = new Date();
      date.getDate();
      this.db
        .executeSql(sql, [NaN, date.toString(), "", true, "",username])
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          console.log("no cree la session");
          reject(error);
        });
    });
  }

  deleteSession() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("DELETE FROM products", [])
        .then(data => {
          this.db.executeSql("DELETE FROM customers", []).then(() => {
            this.db.executeSql("DELETE FROM all_tax", []).then(() => {
              this.db.executeSql("DELETE FROM method_payment", []).then(() => {
                resolve();
              });
            });
          });
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          reject(err);
        });
    });
  }

  closeSession() {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE session SET is_open = ?, date_end = ? where id = ? ";
      let date = new Date();
      this.db
        .executeSql(sql, [false, date.toString(), this.arraySession])
        .then(data => {
          this.arraySession = 0;
          console.log(JSON.stringify(data));
          resolve();
        })
        .catch(error => {
          console.log(JSON.stringify(error));
          reject(error);
        });
    });
  }

  //insertar  en la base de datos
  saveProduct(product) {
    return new Promise((resolve, reject) => {
      let sqlInsert = "insert into products VALUES(?,?,?,?,?,?,?,?)";
      this.db
        .executeSql(sqlInsert, [
          NaN,
          product.name,
          product.category,
          product.price,
          product.qty,
          product.id,
          product.tax,
          this.username
        ])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(
            "error al intentar insertar en product " + JSON.stringify(err)
          );
          reject(err);
        });
    });
  }
  saveMethodPayment(product) {
    return new Promise((resolve, reject) => {
      let sqlInsert = "insert into method_payment VALUES(?,?,?,?,?,?)";
      this.db
        .executeSql(sqlInsert, [
          NaN,
          product.id,
          product.name,
          product.code,
          product.type,
          this.username
        ])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(
            "error al intentar insertar en methodpaymet " + JSON.stringify(err)
          );
          reject(err);
        });
    });
  }

  saveAllCustomer(customer) {
    return new Promise((resolve, reject) => {
      this.data = [];
      this.rowArgs = [];

      let sqlInsert = "insert into customers VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
      /*  for (let i in product) {
        let id = NaN;
        this.rowArgs.push("(?, ?, ?, ?, ?, ?, ?, ?)");
        this.data.push(id);
        this.data.push(product[i].name);
        this.data.push(product[i].address);
        this.data.push(product[i].phone);
        this.data.push(product[i].mobile);
        this.data.push(product[i].website);
        this.data.push(product[i].id_odoo);
        this.data.push(product[i].email);
       
      }
      sqlInsert += this.rowArgs;
      console.log(sqlInsert)
      console.log(this.data)*/

      this.db
        .executeSql(sqlInsert, [
          NaN,
          customer.name,
          customer.address,
          customer.phone,
          customer.mobile,
          customer.website,
          customer.id_odoo,
          customer.email,
          this.username

        ])
        .then(data => {
          resolve();
        })
        .catch(err => {
          console.log(
            "error al intentar insertar en allcustomer " + JSON.stringify(err)
          );
        });
    });
  }

  newTax(tax) {
    return new Promise((resolve, reject) => {
      let sqlInsert = "insert into all_tax VALUES(?,?,?,?,?)";
      this.db
        .executeSql(sqlInsert, [NaN, tax.id_odoo, tax.name, tax.amount, tax.username])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(
            "error al intentar crear los impuestos " + JSON.stringify(err)
          );
          reject(err);
        });
    });
  }

  newProductReceipt(product) {
    return new Promise((resolve, reject) => {
      let sqlInsert = "insert into product VALUES(?,?,?,?,?,?,?,?)";
      this.db
        .executeSql(sqlInsert, [
          NaN,
          product.name,
          product.price,
          product.qty,
          product.id_producto,
          product.id_recibo,
          product.tax,
          this.username
        ])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log("error al intentar los productos " + JSON.stringify(err));
          reject(err);
        });
    });
  }

  newReceipt(receipt) {
    return new Promise((resolve, reject) => {
      let sqlInsert = "insert into receipt VALUES(?,?,?,?,?,?,?,?,?,?)";
      this.db
        .executeSql(sqlInsert, [
          NaN,
          receipt.id_session,
          receipt.total,
          receipt.fecha,
          receipt.payment_id,
          receipt.id_customer,
          receipt.name_customer,
          receipt.total_tax,
          false,
          this.username
        ])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(
            "error al intentar insertar en receipt " + JSON.stringify(err)
          );
          reject(err);
        });
    });
  }

  //consultas para hacer select en la base de datos
  selectProduct() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM products where user = ?", [this.username])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  selectMethodPayment() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM method_payment where user = ?", [this.username])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  selectCustomer( counter ) {
    return new Promise(( resolve, reject ) => {
      this.db
        .executeSql( "SELECT * FROM customers where user = ? limit ? ,25", [ this.username, counter ] )
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  selectReceipt() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM receipt", [])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  selectReceiptSession(id) {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM receipt WHERE id_session = ? AND user = ?", [id, this.username])
        .then((receipt: any) => {
          if (receipt.rows.length > 0) {
            for (var i = 0; i < receipt.rows.length; i++) {
              this.allReceipt.push({
                id: receipt.rows.item(i).id,
                id_session: receipt.rows.item(i).id_session,
                total: receipt.rows.item(i).total,
                fecha: receipt.rows.item(i).fecha,
                payment_id: receipt.rows.item(i).payment_id,
                id_customer: receipt.rows.item(i).id_customer,
                name_customer: receipt.rows.item(i).name_customer,
                total_tax: receipt.rows.item(i).total_tax
              });
            }
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  selectTax() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM all_tax where user = ?", [this.username])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  selectProductReceipt(id) {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM product WHERE id_recibo = ?", [id])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  selectProductReceiptSession(id) {
    this.db
      .executeSql("SELECT * FROM product WHERE id_recibo = ?", [id])
      .then((products: any) => {
        if (products.rows.length > 0) {
          for (var i = 0; i < products.rows.length; i++) {
            this.productSelect.push({
              id: products.rows.item(i).id,
              name: products.rows.item(i).name,
              qty: products.rows.item(i).cantidad,
              price: products.rows.item(i).precio,
              id_product: products.rows.item(i).id_producto,
              id_receipt: products.rows.item(i).id_recibo,
              tax: products.rows.item(i).tax
            });
          }
        }
      });
  }

  //consultas para buscar informacion en la base de

  searchCustomer(value: string) {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(`SELECT * FROM customers WHERE name LIKE ?`, [
          "%" + value + "%"
        ])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  searchProduct(value: string) {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(`SELECT * FROM products WHERE name LIKE ?`, [
          "%" + value + "%"
        ])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  searchSession() {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM session where is_open = 'true'", [])
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  updateProducts(id, qty) {
    return new Promise((resolve, reject) => {
      this.db
        .executeSql(`UPDATE products SET cantidad = ? WHERE id = ?`, [qty, id])
        .then(() => resolve())

        .catch(err => reject(err));
    });
  }
  /*
  saveAllCustomerLote(product: any[]) {
    return new Promise((resolve, reject) => {
     if(product.length < 100)
     {
      this.data = [];
      this.rowArgs = [];
      let sqlInsert = "insert into customers VALUES";
      for (let i in product) {
        let id = NaN;
        this.rowArgs.push("(?, ?, ?, ?, ?, ?, ?, ?)");
        this.data.push(id);
        this.data.push(product[i].name);
        this.data.push(product[i].address);
        this.data.push(product[i].phone);
        this.data.push(product[i].mobile);
        this.data.push(product[i].website);
        this.data.push(product[i].id_odoo);
        this.data.push(product[i].email);  
      }
      sqlInsert += this.rowArgs;
      console.log(sqlInsert)
      console.log(this.data)
      this.db
        .executeSql(sqlInsert, this.data)
        .then(data => {
          console.log("los guarde")
          resolve();
        })
        .catch(err => {
          console.log(
            "error al intentar insertar en allcustomer " + JSON.stringify(err)
          );
        });
     } else {
      while (product.length != 100) {
        if(this.customers.length < 100)
        {
          for(let i = 0; i <= 100; i++)
          {
            this.customers.push({
              name: product[0].name,
              address: product[0].address,
              phone: product[0].phone,
              mobile: product[0].phone,
              id_odoo: product[0].id_odoo,
              website: product[0].website,
              email: product[0].email
            })
            product.splice(0,1)
          }
        } else {

          this.data = [];
          this.rowArgs = [];
          let sqlInsert = "insert into customers VALUES";
          for (let i in this.customers) {
            let id = NaN;
            this.rowArgs.push("(?, ?, ?, ?, ?, ?, ?, ?)");
            this.data.push(id);
            this.data.push(this.customers[i].name);
            this.data.push(this.customers[i].address);
            this.data.push(this.customers[i].phone);
            this.data.push(this.customers[i].mobile);
            this.data.push(this.customers[i].website);
            this.data.push(this.customers[i].id_odoo);
            this.data.push(this.customers[i].email);  
          }
          sqlInsert += this.rowArgs;
        
         
          this.db
            .executeSql(sqlInsert, this.data)
            .then(data => {
              console.log("los guarde")
              this.customers = []
              resolve();
            })
            .catch(err => {
              console.log(
                "error al intentar insertar en allcustomer " + JSON.stringify(err)
              );
            });

        }
      }
     }
    });
  }*/


}
