import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';
import { Product } from 'src/models/product';
import { ProductDialogData } from 'src/models/product-dialog-modal';
import { Shop } from 'src/models/shop';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {

  stringIsNumber = value => isNaN(Number(value)) === false;
  product: Product = new Product();
  productId: string;
  shopId: string;
  formGroup: FormGroup;
  shop: Shop;

  constructor(public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
    private productService: ProductService,
    private popUp: MatSnackBar,
    private shopService: ShopService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.shopId = this.data.shopId;
    if (this.data.product !== undefined) {
      this.product = { ... this.data.product };
    } else {
      this.product.productId = '';
    }
  }

  createForm() {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      price: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100000)]),
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async submit(product: Product) {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    product.shopId = this.shopId;

    if (product.productId === '') {
      await this.shopService.getById(this.data.shopId).then(x => {
        this.shop = x as Shop;
        if (this.shop.products == null) {
          this.shop.products = new Array<string>();
        }
      })

      product.productId = await this.productService.createProduct(product);
      this.shop.products.push(product.productId);
      this.shop.shopId = this.data.shopId;
      this.shopService.editShop(this.shop);
    }
    else {
      await this.productService.editProduct(product);
    }

    this.dialogRef.close();
    this.popUp.open('Product ' + this.data.action + ' successfully!', 'Ok',
      { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
  }

  getNameErrorMessage() {
    return this.formGroup.controls.name.hasError('required') ? 'Name is required' :
      this.formGroup.controls.name.hasError('min') ? 'Name must be 13 characters' :
        this.formGroup.controls.name.hasError('max') ? 'Name must be 13 characters' : '';
  }

  getDescriptionErrorMessage() {
    return this.formGroup.controls.description.hasError('required') ? 'Description is required' :
      this.formGroup.controls.description.hasError('maxlength') ? 'Description must be low than 10 characters' :
        this.formGroup.controls.description.hasError('minlength') ? 'Description must be more than 5 characters' : '';
  }

  getPriceErrorMessage() {
    return this.formGroup.controls.product.hasError('required') ? 'Price is required' :
      this.formGroup.controls.product.hasError('max') ? 'Maximum value is 100000' :
        this.formGroup.controls.product.hasError('min') ? 'Minimum value is 1' : '';
  }
}
