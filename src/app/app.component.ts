import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuthorize = false;

  ngOnInit(): void {
   if (localStorage.getItem('user')!= null) {
     this.isAuthorize = true;
   }
  }
  title = 'Auth';
}
