import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FirstComponent } from './first/first.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {AuthGuard} from "./auth.guard";
import { HomeComponent } from './home/home.component';
import {TokenInterceptor} from "./services/token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    FirstComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule

],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
