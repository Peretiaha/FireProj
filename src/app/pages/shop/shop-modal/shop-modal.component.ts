import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopService } from 'src/app/services/shop.service';
import { Shop } from 'src/models/shop';
import { ShopDialogData } from 'src/models/shop-dialog-modal';
import { shopSpecification } from 'src/models/shopSpecificationEnum';

@Component({
  selector: 'app-shop-modal',
  templateUrl: './shop-modal.component.html',
  styleUrls: ['./shop-modal.component.scss']
})
export class ShopModalComponent implements OnInit {

  stringIsNumber = value => isNaN(Number(value)) === false;
  shop: Shop = new Shop();
  shopId: number;
  formGroup: FormGroup;
  specifications = new FormControl();
  specificationList = Object.keys(shopSpecification).filter(this.stringIsNumber)
    .map(key => shopSpecification[key]);;

  constructor(public dialogRef: MatDialogRef<ShopModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShopDialogData,
    private shopService: ShopService,
    private popUp: MatSnackBar) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.data.shop !== undefined) {
      this.shop = { ... this.data.shop };
    } else {
      this.shop.shopId = '';
    }
  }

  createForm() {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      website: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]),
      city: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  submit(shop: Shop) {

    shop.specifications = this.specifications.value;

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (shop.shopId === '') {
      this.shopService.createShop(shop);
    } else {
      this.shopService.editShop(shop)
    }

    this.dialogRef.close();
    this.popUp.open('Shop ' + this.data.action + ' successfully!', 'Ok',
      { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });

  }

  getNameErrorMessage() {
    return this.formGroup.controls.name.hasError('required') ? 'Name is required' :
      this.formGroup.controls.name.hasError('min') ? 'Name must be 13 characters' :
        this.formGroup.controls.name.hasError('max') ? 'Name must be 13 characters' : '';
  }

  getCityErrorMessage() {
    return this.formGroup.controls.city.hasError('required') ? 'City is required' :
      this.formGroup.controls.website.hasError('maxlength') ? 'City must be low than 10 characters' :
        this.formGroup.controls.city.hasError('minlength') ? 'City must be more than 5 characters' : '';
  }

  getAddressErrorMessage() {
    return this.formGroup.controls.address.hasError('required') ? 'Address is required' :
      this.formGroup.controls.website.hasError('maxlength') ? 'Address must be low than 10 characters' :
        this.formGroup.controls.address.hasError('minlength') ? 'Address must be more than 3 characters' : '';
  }

  getWebSiteErrorMessage() {
    return this.formGroup.controls.website.hasError('required') ? 'Website is required' :
      this.formGroup.controls.website.hasError('minlength') ? 'Website must be more than 3 characters' :
        this.formGroup.controls.website.hasError('maxlength') ? 'Website must be low than 10 characters' : '';
  }
}
