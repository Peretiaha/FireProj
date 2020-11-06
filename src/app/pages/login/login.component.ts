import { Component, OnInit } from '@angular/core';
import { userViewModel } from 'src/models/userViewModel';
import { FirebaseServiceAuth } from 'src/app/services/firebase-auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { ShopModalComponent } from '../shop/shop-modal/shop-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userViewModel: userViewModel = { email: '', password: '' }
  isSignedIn = false;
  formGroup: FormGroup;
  sereverError = '';

  constructor(private firebaseService: FirebaseServiceAuth, private router: Router,
    private popUp: MatSnackBar,
    public createDialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
  }

  openCreateModal() {
    const dialogRef = this.createDialog.open(ShopModalComponent, {
      width: '500px',
      data: { action: '+ Create New Shop' },
      panelClass: 'custom-dialog-container' 
    });
  }

  createForm() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(7), Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  async login() {
    var error ='';

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }    

    await this.firebaseService.login(this.userViewModel)
    .catch(err=>{
      error = err;
    })    

    this.navigateToProfile(error);
  }

  async loginWithGoogle() {
    var error ='';

    await this.firebaseService.loginWithGoogle().catch(err=>{
      error = err;
    })    

    this.navigateToProfile(error)
  }

  getEmailErrorMessage() {
    const nameErrors = this.formGroup.get('email').errors;
    return nameErrors.required ? 'Email is required' :
      nameErrors.minlength ? 'Email must be at least 7 characters long' :
        nameErrors.email ? 'Its not email address' :          
            null;
  }

  getPasswordErrorMessage() {
    const nameErrors = this.formGroup.get('password').errors;
    return nameErrors.required ? 'Password is required' :
      nameErrors.minlength ? 'Password must be at least 6 characters long' :        
          null;
  }

  private navigateToProfile(error) {
    if (error == '') {
      this.router.navigate(['user-profile'])

    this.popUp.open('Login successfully!', 'Ok',
      { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }
     else {
      this.sereverError = error;
     }
  }
}
