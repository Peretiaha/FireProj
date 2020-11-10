import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Product } from 'src/models/product';
import { Shop } from 'src/models/shop';
import { DeleteModuleComponent } from '../../delete-module/delete-module.component';
import { ShopModalComponent } from '../shop-modal/shop-modal.component';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {

  shops: Shop[];
  products: Product[];
  dataSource: MatTableDataSource<Shop>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['name', 'city', 'address', 'website', 'specification','more','edit','delete'];
  sortedData: Shop[];

  constructor(private router: Router,
    private shopService: ShopService,
    public createDialog: MatDialog,
    ) { }

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
          specifications: e.payload.doc.data()['specifications'],
          imageUrl: e.payload.doc.data()['imageUrl']
        } as Shop;
      })
      
      this.dataSource = new MatTableDataSource(this.shops);
      this.sortedData = this.shops.slice();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    
    const dialogRef = this.createDialog.open(DeleteModuleComponent, {
      panelClass: 'custom-dialog-container',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(x => {
      if (x.data === true) {
    this.shopService.deleteShop(shopId);
      }})
  }

  details(shopId: string) {
    this.router.navigate(['shop/'+ shopId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  sortData(sort: Sort) {
    const data = this.shops.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'city': return this.compare(a.city, b.city, isAsc);
        case 'address': return this.compare(a.address, b.address, isAsc);  
        case 'website': return this.compare(a.website, b.website, isAsc);

        default: return 0;
      }
    });
  }
}
