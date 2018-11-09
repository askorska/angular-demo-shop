import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  user: User;
  userName: string;

  constructor(public auth: AuthService) {
  }

  ngOnInit() {
    this.auth.currentUser$.subscribe(
      (res) => {
        this.userName = res ? res.name : null;
      }
    )
  }

  logout() {
    this.auth.logout();
  }

}
