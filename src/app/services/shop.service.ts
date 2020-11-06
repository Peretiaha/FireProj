import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Shop } from 'src/models/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  
  constructor(private firestore: AngularFirestore) { }

  async createShop(shop: Shop) {
    await this.firestore.collection('shops').add({ ...shop });
  }

  editShop(shop: Shop) {
    this.firestore.doc('shops/' + shop.shopId).update(shop);
  }

  feachShops() {
    return this.firestore.collection<Shop>('shops').valueChanges({ idField: 'shopId' })
  }
  
  deleteShop(shopId: string) {
    this.firestore.doc('shops/' + shopId).delete();
  }

  getById(shopId: string) {
    return this.firestore.collection<Shop>('shops').doc(shopId).valueChanges() as Observable<Shop>;

  }
}
