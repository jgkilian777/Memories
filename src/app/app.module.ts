import {Injectable, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UsergroupsComponent } from './usergroups/usergroups.component';
import {RenameUserGroupDialog, UsergroupComponent} from './usergroup/usergroup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {AppService} from "./app.service";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {Observable} from "rxjs";
import { RegisterComponent } from './register/register.component';
import { CreateUserGroupModalComponent } from './create-user-group-modal/create-user-group-modal.component';
import { CreateMemoryModalComponent } from './create-memory-modal/create-memory-modal.component';
import { CreateAndAddMemoryToUsergroupModalComponent } from './create-and-add-memory-to-usergroup-modal/create-and-add-memory-to-usergroup-modal.component';
import { AddMemoryToUsergroupComponent } from './add-memory-to-usergroup/add-memory-to-usergroup.component';
import { MemoriesComponent } from './memories/memories.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { InviteUserToUserGroupModalComponent } from './invite-user-to-user-group-modal/invite-user-to-user-group-modal.component';
import { UserGroupUsersTabComponent } from './user-group-users-tab/user-group-users-tab.component';
import { ViewMemoryModalComponent } from './view-memory-modal/view-memory-modal.component';
import { ModifyMemoriesInUsergroupComponent, RenameMemoryDialog } from './modify-memories-in-usergroup/modify-memories-in-usergroup.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { ViewUserMemoryModalComponent } from './view-user-memory-modal/view-user-memory-modal.component';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(xhr);
  }
}


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });
    return next.handle(req);
  }
}


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: HomeComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'memories', component: MemoriesComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    UsergroupsComponent,
    UsergroupComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    CreateUserGroupModalComponent,
    CreateMemoryModalComponent,
    CreateAndAddMemoryToUsergroupModalComponent,
    AddMemoryToUsergroupComponent,
    MemoriesComponent,
    InviteUserToUserGroupModalComponent,
    UserGroupUsersTabComponent,
    ViewMemoryModalComponent,
    ModifyMemoriesInUsergroupComponent,
    RenameMemoryDialog,
    ViewUserMemoryModalComponent,
    RenameUserGroupDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,

  ],
  providers: [AppService , { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }, { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
