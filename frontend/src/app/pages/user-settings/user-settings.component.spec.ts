import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsComponent } from './user-settings.component';
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { UserService } from "../../common/services/api/user.service";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { User } from "../../common/models/api/user.model";
import { of } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  let currentUser: User;
  let spyUserService: Partial<jasmine.SpyObj<UserService>>;
  let spyAuthenticationService: Partial<jasmine.SpyObj<AuthenticationService>>;

  beforeEach(()=> {
    currentUser = {
      token: '1',
      username: 'test',
      email: 'a@example.com'
    };

    spyUserService = {
      updateUser: jasmine.createSpy('updateUser')
    };
    spyUserService.updateUser!.and.returnValue(of({user: currentUser}));

    spyAuthenticationService = {
      logout: jasmine.createSpy('logout'),
      currentUser$: of(currentUser),
      login: jasmine.createSpy('login')
    };
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSettingsComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        {provide: UserService, useValue: spyUserService},
        {provide: AuthenticationService, useValue: spyAuthenticationService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    component.logout();
    expect(spyAuthenticationService.logout).toHaveBeenCalled();
  });
});
