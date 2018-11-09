import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Role, User} from "../models/user.model";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = new BehaviorSubject<User>(null);
  isUserLogged: boolean;
  isAdminLogged: boolean;

  constructor(private http: HttpClient, private router: Router) {
    this.retriveUser();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}login`, {login: username, password: password},
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        observe: "response", responseType: 'text'
      }).pipe(map(res => {
      if (res.headers.get('session-token')) {
        let token = res.headers.get('session-token');
        this.saveSessionToken(token);
        this.isUserLogged = true;
        this.setNewUser(username, token);
        return true
      } else return false;
    }));
  }

  logout() {
    this.isUserLogged = false;
    this.currentUser$.next(null);
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  saveSessionToken(token) {
    localStorage.setItem('sessionToken', token);
  }

  getUserData(name: string): Observable<any> {
    return this.http.get(`${API_URL}users`).pipe(map((res: any) => {
      return res.filter(user => user.login === name)[0];
    }));
  }

  setNewUser(name: string, token) {
    var userData$ = this.getUserData(name);
    let userData: object;
    userData$.subscribe(
      (res) => {
        userData = res;
        if (userData.hasOwnProperty('login')){
          localStorage.setItem('user', JSON.stringify(userData));
        }
        this.updateUser(userData)
      },
      (err) => {
        console.log("Couldn't get user data");
      }

    );
  }

  retriveUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    let token = localStorage.getItem('sessionToken');
    if (userData && token) {
      this.updateUser(userData);
      this.isUserLogged = true;
    }
  }

  updateUser(userData) {
    let user = new User(userData.id, userData.login, userData.roleId as Role);
    this.currentUser$.next(user);
  }
}
