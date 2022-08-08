import { Component, OnInit } from '@angular/core';
import {UserGroup} from "./userGroup";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AppService} from "../app.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {Router} from "@angular/router";
import {StorageService} from "../auth/storage.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreateUserGroupModalComponent} from "../create-user-group-modal/create-user-group-modal.component";
import {UsergroupsService} from "./usergroups.service";
import {LoadUserGroupResponse} from "../usergroup/loadUserGroupResponse";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {PendingUserInGroupView} from "../usergroup/pendingUserInGroupView";
import {UserInGroupView} from "../usergroup/userInGroupView";

@Component({
  selector: 'app-usergroups',
  templateUrl: './usergroups.component.html',
  styleUrls: ['./usergroups.component.css']
})
export class UsergroupsComponent implements OnInit {

  userGroupActionFailed=false;
  errorMessage="";

  constructor(private userGroupService: UserGroupService, private storageService: StorageService, private modalService: NgbModal, private usergroupsService: UsergroupsService) { }

  public userGroups: UserGroup[];
  public pendinguserGroups: UserGroup[];
  isLoggedIn = false;
  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
    this.getPendingUserGroups();
    this.getUserGroups();
  }

  ngOnDestroy(): void {
    this.loadUserGroupsObservable$.unsubscribe();
    // this.loadUserGroupPendingUsersObservable$.unsubscribe();
    // this.loadUserGroupUsersObservable$.unsubscribe();
  }

  loadUserGroupsObservable$ = this.userGroupService.getLoadUserGroups().pipe(
    switchMap(success => {
        return this.usergroupsService.getUserGroups();
      }

    ),
    catchError(error => {
      console.log(error);
      return throwError(error);
    })

  ).subscribe(
    {
      next: (response: UserGroup[]) => {
        this.userGroups = response;

      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    }
  );


  public getUserGroups(): void {
    this.usergroupsService.getUserGroups().subscribe({
      next: (response: UserGroup[]) => {
        this.userGroups = response;
        console.log(this.userGroups);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });

  }

  // public getPendingUserGroupsObservable(): Observable<any> {
  //   return
  // }

  public getPendingUserGroups(): void {
    this.usergroupsService.getPendingUserGroups().subscribe({
      next: (response: UserGroup[]) => {
        this.pendinguserGroups = response;
        console.log(this.pendinguserGroups);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });

  }

  public openCreateUserGroupModal(): void {
    const modalRef = this.modalService.open(CreateUserGroupModalComponent);

  }

  acceptUserGroupInvite(usergroupId: number){
    this.userGroupService.acceptUserGroupInvite(usergroupId).pipe(
      switchMap( response =>
      {
        return this.usergroupsService.getPendingUserGroups();}
      ),
      switchMap( pendingUserGroups =>
        {
          this.pendinguserGroups = pendingUserGroups;
          return this.usergroupsService.getUserGroups();}
      ),
      catchError(error => {
        console.log(error);
        this.userGroupActionFailed=true;
        this.errorMessage=error;
        return throwError(error);
      })).subscribe(

      {
      next: (usergroups) => {
        // console.log(response);
        this.userGroups = usergroups;
        this.userGroupActionFailed=false;
        // this.getPendingUserGroups();
      },
      error: (err) => {
        console.log(err);
        this.userGroupActionFailed=true;
        this.errorMessage=err;
      }
    })
  }

  declineUserGroupInvite(usergroupId: number){
    this.userGroupService.declineUserGroupInvite(usergroupId).pipe(
      switchMap( response =>
        {return this.usergroupsService.getPendingUserGroups();}
      ),
      catchError(error => {
        console.log(error);
        this.userGroupActionFailed=true;
        this.errorMessage=error;
        return throwError(error);
      })).subscribe({
      next: (usergroups) => {
        // console.log(response);
        this.pendinguserGroups = usergroups;
        this.userGroupActionFailed=false;
        // this.getPendingUserGroups();
      },
      error: (err) => {
        console.log(err);
        this.userGroupActionFailed=true;
        this.errorMessage=err;
      }
    })
  }

  // public getUserGroup(userGroupId: number): void {
  //   this.userGroupService.getUserGroup(userGroupId).subscribe({
  //     next: (response: UserGroup) => {
  //       this.currUserGroup = response;
  //       console.log(this.currUserGroup);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   });
  //
  // }

  public loadUserGroupFromUserGroups(usergroupId: number): void{
    this.userGroupService.setLoadUserGroupId(usergroupId);
  }

  // public loadUserGroup(usergroupId: number): void {
  //
  //     this.usergroupsService.loadUserGroup(usergroupId).subscribe({
  //     next: (response) => {
  //       let loadUserGroupResponse: LoadUserGroupResponse = {loadUserGroupSuccess: true, err: ""}
  //       this.userGroupService.setLoadUserGroupResponse(loadUserGroupResponse);
  //     },
  //       error: (err) => {
  //         let loadUserGroupResponse: LoadUserGroupResponse = {loadUserGroupSuccess: false, err: err}
  //         this.userGroupService.setLoadUserGroupResponse(loadUserGroupResponse);
  //       }
  //   });
  //
  //
  // }

}
