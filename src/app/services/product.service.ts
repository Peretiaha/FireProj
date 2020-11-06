import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from 'src/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private firestore: AngularFirestore) { }
  
  async createProduct(product: Product) {
    await this.firestore.collection('products').add({...product});
  }

  editProduct(product: Product) {
    this.firestore.doc('products/'+ product.productId).update(product);
  }

   feachProducts() {
     return this.firestore.collection<Product>('products').valueChanges({idField: 'productId'})
  }

  deleteProduct(productId: string){
    this.firestore.doc('products/'+ productId).delete();
  }

  getById(productId: string) {
    return this.firestore.collection('products').doc(productId).valueChanges() as Observable<Product>;
  }

  generateId() {
    return this.firestore.createId();
  }
}
