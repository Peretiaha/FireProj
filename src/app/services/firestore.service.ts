import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Shop } from 'src/models/shop';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // getShops(): Observable<Shop[]>  {
  //   var shops = this.firestore.collection('shops').valueChanges() as Observable<Shop[]>;

  //   return shops;
  // }

  getShops(shop: Shop) {
    this.firestore.collection('shops').add({...shop});
  }
}
