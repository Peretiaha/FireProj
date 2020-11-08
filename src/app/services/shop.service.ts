import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, Subject } from 'rxjs';
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
    return this.firestore.collection<Shop>('shops').snapshotChanges();
  }

  deleteShop(shopId: string) {
    this.firestore.doc('shops/' + shopId).delete();
  }

  async getById(shopId: string) {
    let document = await (await this.firestore.collection('shops').doc(shopId).ref.get());
    var shop = document.data() as Shop;
    shop.shopId = document.id;
    return shop;
  }
}