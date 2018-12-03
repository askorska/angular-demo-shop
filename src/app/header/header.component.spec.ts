import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {AuthService} from "../services/auth.service";
import {BehaviorSubject} from "rxjs";
import {Role, User} from "../models/user.model";


class FakeUser extends User {

}

class MockAuthService {
  currentUser$ = new BehaviorSubject<FakeUser>(null);
  logout() {};
}


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let service: MockAuthService;
  let user: FakeUser;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent],
      providers: [
        {provide: AuthService, useClass: MockAuthService}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(AuthService);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('logout should call logout in authSerivce', ()=>{
    spyOn(service, 'logout');
    component.logout();
    expect(service.logout).toHaveBeenCalled();
  });

  it('userName should be changed after new user has been emitted by currentUser BehaviorSubject', ()=>{
    expect(component.userName).toEqual(null);
    user = new FakeUser(5, "Ally", Role.Admin);
    service.currentUser$.next(user);
    expect(component.userName).toEqual("Ally");
  })
});
