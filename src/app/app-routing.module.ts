import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {FirstComponent} from "./first/first.component";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./auth.guard";


const routes: Routes = [
  { path: '',   component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'first', component: FirstComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
