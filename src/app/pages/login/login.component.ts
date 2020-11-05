import { Component, OnInit } from '@angular/core';
import { userViewModel } from 'src/models/userViewModel';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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

  constructor(private firebaseService: FirebaseService, private router: Router,
    private popUp: MatSnackBar) { }

  ngOnInit(): void {
    this.createForm();
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
