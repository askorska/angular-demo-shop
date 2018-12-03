import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginFailed: boolean;
  loginForm: FormGroup;
  login: FormControl;
  password: FormControl;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {};

  ngOnInit() {
    if (this.authService.isUserLogged) {
      this.router.navigate(['']);
    }

    this.login = new FormControl('', [Validators.required,  Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]);
    this.password = new FormControl('', Validators.required);
    this.loginForm = new FormGroup({
      'login': this.login,
      'password': this.password
    });
  }

  onSubmit() {
    this.authService.login(this.login.value, this.password.value).subscribe(res => {
        if (res) {
          let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/']);
        }
        else console.log("other error");
      },
      err => {
        this.loginFailed = true;
        return false;
      }
    );


  }


}
