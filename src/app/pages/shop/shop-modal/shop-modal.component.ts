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
  selectedImage: any = null;

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
    console.log(this.shop)
  }

  createForm() {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      website: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]),
      city: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      // imageUrl: new FormControl('', [Validators.required]),
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async submit(shop: Shop) {

    shop.specifications = this.specifications.value;

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if(shop.products == null)
      shop.products = [];

    if (shop.shopId === '') {
      var filePath = `shops/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      this.shopService.createShop(shop, filePath, this.selectedImage);
    } else {
      this.shopService.editShop(shop)
    }

    this.dialogRef.close();
    this.popUp.open('Shop ' + this.data.action + ' successfully!', 'Ok',
      { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.shop.imageUrl = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
  }

  getNameErrorMessage() {
    return this.formGroup.controls.name.hasError('required') ? 'Name is required' :
      this.formGroup.controls.name.hasError('minlength') ? 'Name must be 5 characters' :
        this.formGroup.controls.name.hasError('maxlength') ? 'Name must be 30 characters' : '';
  }

  getCityErrorMessage() {
    return this.formGroup.controls.city.hasError('required') ? 'City is required' :
      this.formGroup.controls.website.hasError('maxlength') ? 'City must be low than 30 characters' :
        this.formGroup.controls.city.hasError('minlength') ? 'City must be more than 5 characters' : '';
  }

  getAddressErrorMessage() {
    return this.formGroup.controls.address.hasError('required') ? 'Address is required' :
      this.formGroup.controls.website.hasError('maxlength') ? 'Address must be low than 30 characters' :
        this.formGroup.controls.address.hasError('minlength') ? 'Address must be more than 5 characters' : '';
  }

  getWebSiteErrorMessage() {
    return this.formGroup.controls.website.hasError('required') ? 'Website is required' :
      this.formGroup.controls.website.hasError('minlength') ? 'Website must be more than 7 characters' :
        this.formGroup.controls.website.hasError('maxlength') ? 'Website must be low than 30 characters' : '';
  }
}
