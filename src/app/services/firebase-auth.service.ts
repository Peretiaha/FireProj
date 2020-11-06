import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { userViewModel } from 'src/models/userViewModel';
import firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceAuth {

  isLoggedIn = false
  
  constructor(private firebaseAuth: AngularFireAuth) { }

   async login(userViewModel: userViewModel) {
      await this.firebaseAuth.signInWithEmailAndPassword(userViewModel.email, userViewModel.password)
      .then(x => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(x.user))
      });
    }

  async registration(userViewModel: userViewModel) {
    await this.firebaseAuth.createUserWithEmailAndPassword(userViewModel.email, userViewModel.password)
      .then(x => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(x.user));
      })
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.isLoggedIn = false;
  }

  async loginWithGoogle() {
    await this.firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(x=>{
      this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(x.user));
    });
  }   
}
