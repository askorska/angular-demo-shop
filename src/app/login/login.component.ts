import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

// import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
  }

  loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });


  onSubmit() {
    let login = this.loginForm.controls['login'].value;
    let password = this.loginForm.controls['password'].value;
    this.authService.login(login, password).subscribe(res => {
        if (res) {
          let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/']);
        } else console.log("something went wrong")
      },
      err => {
        console.log("Error occured");
        return false;
      }
    );


  }


}
