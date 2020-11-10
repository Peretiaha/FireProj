import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';
import { Product } from 'src/models/product';
import { Shop } from 'src/models/shop';
import { ProductModalComponent } from '../../product/product-modal/product-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { DeleteModuleComponent } from '../../delete-module/delete-module.component';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {

  public shopId: string;
  shop: Shop = new Shop();
  dataSource: MatTableDataSource<Product>;
  products: Product[];
  public displayedColumns: string[] = ['name', 'description', 'price', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sortedData: Product[];

  constructor(private route: ActivatedRoute,
    private shopService: ShopService,
    public createDialog: MatDialog,
    private productService: ProductService) {
     }

  async ngOnInit() {
    this.shopId = this.route.snapshot.paramMap.get('id');
    this.shop = await this.shopService.getById(this.shopId) as Shop;

    this.productService.feachProductsByShopId(this.shopId).subscribe(data => {
     this.products = data.map(e => {
        return {
          productId: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          description: e.payload.doc.data()['description'],
          price: e.payload.doc.data()['price'],
          shopId: e.payload.doc.data()['shopId']
        } as Product;
      });

      this.dataSource = new MatTableDataSource(this.products);
      this.sortedData = this.products.slice();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openCreateProductModal() {
    const dialogRef = this.createDialog.open(ProductModalComponent, {
      width: '500px',
      data: { action: '+ Create New Product', shopId: this.shopId },
      panelClass: 'custom-dialog-container'
    });
  }

  onEditProductModule(product: Product) {
    const dialogRef = this.createDialog.open(ProductModalComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'Edit', product, shopId: this.shopId }
    });
  }

  deleteProduct(productId: string) {

    const dialogRef = this.createDialog.open(DeleteModuleComponent, {
      panelClass: 'custom-dialog-container',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(x => {
      if (x.data === true) {
        this.productService.deleteProduct(productId);
        const index = this.shop.products.indexOf(productId, 0);
        if (index > -1) {
          this.shop.products.splice(index, 1);
        }

        this.shopService.editShop(this.shop);
      }
    });
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
    const data = this.products.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'description': return this.compare(a.description, b.description, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);        
        default: return 0;
      }
    });
  }
}

