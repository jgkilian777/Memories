import { Component } from '@angular/core';
import { UserGroup } from './usergroups/userGroup';
import { UserGroupService } from './usergroup/user-group.service';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import {HttpErrorResponse} from "@angular/common/http";
import {finalize} from 'rxjs/operators';
import {Router} from "@angular/router";
import {StorageService} from "./auth/storage.service";
import {AuthService} from "./auth/auth.service";
// import {$, jquery} from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  // showAdminBoard = false;
  // showModeratorBoard = false;
  username?: string;
  constructor(private storageService: StorageService, private authService: AuthService) { }
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.username = user.username;
    }
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
      },
      error: err => {
        console.log(err);
      }
    });

    window.location.reload();
  }
}
