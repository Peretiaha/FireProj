import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseServiceAuth } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userEmail: string;
  name: string;

  constructor(private firebaseService: FirebaseServiceAuth,
    private router: Router, private popUp: MatSnackBar) {
  }

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('user'));

    if (user == null) {
      this.router.navigate(['/login'])
    }

    this.userEmail = user['email'];
    this.name = user['displayName'];
  }

  logout() {
    this.firebaseService.logout();

    this.popUp.open('Logout successfully', 'Ok',
      { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    this.router.navigate(['/login'])
  }
}
