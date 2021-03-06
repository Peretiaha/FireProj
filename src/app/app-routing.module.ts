import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ShopDetailsComponent } from './pages/shop/shop-details/shop-details.component';
import { ShopListComponent } from './pages/shop/shop-list/shop-list.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

const routes: Routes = [

  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'profile', component: UserProfileComponent},
  {path: 'user-profile', component: UserProfileComponent},
  {path: 'shops', component: ShopListComponent},
  {path: 'shop/:id', component: ShopDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
