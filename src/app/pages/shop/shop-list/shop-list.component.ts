import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Product } from 'src/models/product';
import { Shop } from 'src/models/shop';
import { ShopModalComponent } from '../shop-modal/shop-modal.component';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {

  shops: Shop[];
  products: Product[];


  constructor(private router: Router,
    private shopService: ShopService,
    public createDialog: MatDialog) { }

  ngOnInit(): void {
    this.shopService.feachShops().subscribe(data=>{
      this.shops = data.map(e => {
        return {          
          shopId: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          city: e.payload.doc.data()['city'],
          address: e.payload.doc.data()['address'],
          website: e.payload.doc.data()['website'],
          products: e.payload.doc.data()['products'],
          specifications: e.payload.doc.data()['specifications']
        } as Shop;
      })
    })
  } 

  openCreateModal() {
    const dialogRef = this.createDialog.open(ShopModalComponent, {
      width: '500px',
      data: { action: '+ Create New Shop' },
      panelClass: 'custom-dialog-container' 
    });
  }

  onEditModule(shop: Shop) {
    const dialogRef = this.createDialog.open(ShopModalComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container' ,
      data: { action: 'Edit', shop }
    });    
  }

  deleteShop(shopId: string) {
    this.shopService.deleteShop(shopId);
  }

  details(shopId: string) {
    this.router.navigate(['shop/'+ shopId]);
  }
}
