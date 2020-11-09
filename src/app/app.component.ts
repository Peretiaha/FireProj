import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuthorize = false;

  constructor(private router: Router){

  }

  ngOnInit(): void {
   if (localStorage.getItem('user')!= null) {
     this.isAuthorize = true;
   }
  }
  title = 'Auth';

  login() {
    if (localStorage.getItem('user')!= null) {
      this.router.navigate(['/user-profile']);
    }
    else {
    this.router.navigate(['/login']);
  }
  }
}
