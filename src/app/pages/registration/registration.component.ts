import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseServiceAuth } from 'src/app/services/firebase-auth.service';
import { userViewModel } from 'src/models/userViewModel';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  userViewModel: userViewModel = { email: '', password: '' }
  formGroup: FormGroup;
  sereverError = '';

  constructor(private firebaseService: FirebaseServiceAuth,
    private router: Router, private popUp: MatSnackBar) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(7), Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async registration() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    var error = '';

    await this.firebaseService.registration(this.userViewModel).catch(err=>{
      this.sereverError = err;
      error = err;
    })    

    this.navigateToProfile(error);
  }

  getEmailErrorMessage() {
    const nameErrors = this.formGroup.get('email').errors;
    return nameErrors.required ? 'Email is required' :
      nameErrors.minlength ? 'Email must be at least 7 characters long' :
        nameErrors.email ? 'Its not email address' :
          !!nameErrors.serverErrors ? nameErrors.serverErrors :
            null;
  }

  getPasswordErrorMessage() {
    const nameErrors = this.formGroup.get('password').errors;
    return nameErrors.required ? 'Password is required' :
      nameErrors.minlength ? 'Password must be at least 6 characters long' :
        !!nameErrors.serverErrors ? nameErrors.serverErrors :
          null;
  }

  private navigateToProfile(error) {
    if (error == '') {
      this.router.navigate(['user-profile'])

    this.popUp.open('User signUp successfully!', 'Ok',
      { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }
  }
}
