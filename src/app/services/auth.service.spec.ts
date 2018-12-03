import {async, TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Role, User} from "../models/user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import mockLocalStorage from "../mocks/mockLocalStorage"

class FakeUser extends User {
}
describe('AuthService', () => {
  let service: AuthService;
  let routerSpy = {
    navigate: jasmine.createSpy('navigate')
  };
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [HttpClientTestingModule],
        providers: [{provide: Router, useValue: routerSpy}]
      }).compileComponents();

    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);

      spyOn(localStorage, 'getItem')
        .and.callFake(mockLocalStorage.getItem);
      spyOn(localStorage, 'setItem')
        .and.callFake(mockLocalStorage.setItem);
      spyOn(localStorage, 'removeItem')
        .and.callFake(mockLocalStorage.removeItem);
      spyOn(localStorage, 'clear')
        .and.callFake(mockLocalStorage.clear);
    }
  ));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy()
  });

  describe('Login', () => {
    let loginRequest: any;
    let usersRequest: any;
    const loginUrl: string = `${environment.apiUrl}login`;
    const responseParamsDefault = {
      headers: {'session-token': 'testToken'},
      status: 200,
      statusText: 'OK'
    };
    const responseParamsNoToken = {
      status: 200,
      statusText: 'OK'
    };
    const responseUsers: Array<Object> = [{"id": 0,"login": "tom","password": "testpswd","roleId": 0}];

    beforeEach(async(() => {

    }));

    it('should post request with username and password', () => {
      service.login("John", "Smith").subscribe(res => {
      });
      loginRequest = httpMock.expectOne(loginUrl);
      expect(loginRequest.request.method).toBe("POST");
      expect(loginRequest.request.body).toEqual({login: 'John', password: 'Smith'});
    });

    it('should return true if successful', () => {
      service.login("John", "somepswd").subscribe(res => {
        expect(res).toBe(true);
      });
      loginRequest = httpMock.expectOne(loginUrl);
      loginRequest.flush("OK", responseParamsDefault);
    });

    it('should return false if no session token in response', () => {
      service.login("John", "somepswd").subscribe(res => {
        expect(res).toBe(false);
      });
      loginRequest = httpMock.expectOne(loginUrl);
      loginRequest.flush("OK", responseParamsNoToken);
    });

    it('should get and save session token', () => {
      service.login("John", "somepswd").subscribe(res => {
        expect(mockLocalStorage.getItem('sessionToken')).toBe("testToken");
      });
      loginRequest = httpMock.expectOne(loginUrl);
      loginRequest.flush("OK", responseParamsDefault);

    });

    it('should set isUserLogged to true', () => {
      service.login("John", "somepswd").subscribe(res => {
        expect(service.isUserLogged).toBe(true);
      });
      loginRequest = httpMock.expectOne(`${environment.apiUrl}login`);
      loginRequest.flush("OK", responseParamsDefault);
    });

    it('should set new user and save it in storage', () => {
      expect(service.currentUser$.getValue()).toBe(null);
      service.login("tom", "somepswd").subscribe(res => {
        usersRequest = httpMock.expectOne(`${environment.apiUrl}users`);
        usersRequest.flush(responseUsers);
        expect(usersRequest.request.method).toBe("GET");
        expect(service.currentUser$.getValue().login).toBe("tom");
        expect(mockLocalStorage.getItem('user')).toContain("tom");
      });
      loginRequest = httpMock.expectOne(loginUrl);
      loginRequest.flush("OK", responseParamsDefault);
    });
  });

  describe('Logout', () => {
    let user: FakeUser;
    beforeEach(() => {
      user = new FakeUser(5, "Ally", Role.CommonUser);
    });

    it('should set isUserLogged to false', () => {
      service.isUserLogged = true;
      service.logout();
      expect(service.isUserLogged).toBe(false);
    });

    it('currentUser$ value should be null', () => {
      service.currentUser$.next(user);
      expect(service.currentUser$.getValue()).toEqual(user);
      service.logout();
      expect(service.currentUser$.getValue()).toEqual(null);
    });

    it('session token should be removed from local storage', () => {
      mockLocalStorage.setItem('sessionToken', 'sometoken');
      expect(mockLocalStorage.getItem('sessionToken')).toEqual('sometoken');
      service.logout();
      expect(mockLocalStorage.getItem('sessionToken')).toEqual(null);
    });

    it('user should be removed from local storage', () => {
      mockLocalStorage.setItem('user', JSON.stringify(user));
      expect(mockLocalStorage.getItem('user')).toContain("Ally");
      service.logout();
      expect(mockLocalStorage.getItem('user')).toEqual(null);
    });

    it('should be redirected to /login', () => {
      let router = TestBed.get(Router);
      service.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
    afterEach(() => {
      httpMock.verify();
    });
  });
});


