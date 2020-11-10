import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Shop } from 'src/models/shop';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, from, of, } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  imageUrl: string;
  snapshot: Observable<any>;

  constructor(private firestore: AngularFirestore,
    private firestorage: AngularFireStorage) { }

  editShop(shop: Shop, path = '', file: any = null) {
    if (path != '' && file != null){
      const fileRef = this.firestorage.ref(path);
      this.firestorage.upload(path, file).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            shop.imageUrl = url
            this.firestore.doc('shops/' + shop.shopId).update(shop);
          })
        })
      ).subscribe();
    }
   else {
    this.firestore.doc('shops/' + shop.shopId).update(shop);
   }    
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

  createShop(shop: Shop, path: string, file: any){
    const fileRef = this.firestorage.ref(path);
    this.firestorage.upload(path, file).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          shop.imageUrl = [];
          shop.imageUrl.push(url as string)
          this.firestore.collection('shops').add({ ...shop });
        })
      })
    ).subscribe();
  }
  
  // uploadFile(event) {
  //   // reset the array 
  //   this.uploads = [];
  //   this.downloadURLs = [];
  //   const filelist = event.target.files;
  //   const allPercentage: Observable<number>[] = [];

  //   for (const file of filelist) {
  //     const filePath = `${file.name}`;
  //     const fileRef = this.firestorage.ref(filePath);
  //     const task = this.firestorage.upload(filePath, file);
  //     const _percentage$ = task.percentageChanges();
  //     allPercentage.push(_percentage$);

  //     // observe percentage changes
  //     this.uploadPercent = task.percentageChanges();

  //     // get notified when the download URL is available
  //     task.snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe((url) => { 
  //           this.downloadURLs = this.downloadURLs.concat([url]);
  //         });
  //       })
  //     ).subscribe();
  //     // this.downloadURLs.push(this.downloadURL);
  //   }
  // }
}