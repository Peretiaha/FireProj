import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';
import { Product } from 'src/models/product';
import { Shop } from 'src/models/shop';
import { ProductModalComponent } from '../../product/product-modal/product-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements AfterViewInit, OnInit {

  public id: string;
  shop: Shop;
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['name', 'description', 'price', 'edit', 'delete'];
  products: Array<Product>;

  constructor(private route: ActivatedRoute,
    private shopService: ShopService,
    public createDialog: MatDialog,
    private productService: ProductService) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.shop = await this.shopService.getById(this.id) as Shop;
    this.dataSource = new MatTableDataSource(this.shop.products as Product[])
    // this.productService.feachProducts().subscribe(x => {
    //   this.dataSource = new MatTableDataSource(x)
    // })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openCreateProductModal() {
    const dialogRef = this.createDialog.open(ProductModalComponent, {
      width: '500px',
      data: { action: '+ Create New Product', shopId: this.id },
      panelClass: 'custom-dialog-container'
    });
  }

  onEditProductModule(product: Product) {
    const dialogRef = this.createDialog.open(ProductModalComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'Edit', product }
    });
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
