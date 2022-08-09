import { Component, OnInit } from '@angular/core';
import {UserGroup} from "./userGroup";
import {HttpErrorResponse} from "@angular/common/http";
import {UserGroupService} from "../usergroup/user-group.service";
import {StorageService} from "../auth/storage.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreateUserGroupModalComponent} from "../create-user-group-modal/create-user-group-modal.component";
import {UsergroupsService} from "./usergroups.service";
import {catchError, switchMap, throwError} from "rxjs";

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
  }

  loadUserGroupsObservable$ = this.userGroupService.getLoadUserGroups().pipe(
    switchMap(success => {
        return this.usergroupsService.getUserGroups();
      }
    ),
    catchError(error => {
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
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });

  }

  public getPendingUserGroups(): void {
    this.usergroupsService.getPendingUserGroups().subscribe({
      next: (response: UserGroup[]) => {
        this.pendinguserGroups = response;
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
        return throwError(error);
      })
    ).subscribe({
      next: (usergroups) => {
        this.userGroups = usergroups;
        this.userGroupActionFailed=false;
      },
      error: (err) => {
        this.userGroupActionFailed=true;
        this.errorMessage=err.message;
      }
    })
  }

  declineUserGroupInvite(usergroupId: number){
    this.userGroupService.declineUserGroupInvite(usergroupId).pipe(
      switchMap( response =>
        {return this.usergroupsService.getPendingUserGroups();}
      ),
      catchError(error => {
        return throwError(error);
      })).subscribe({
      next: (usergroups) => {
        this.pendinguserGroups = usergroups;
        this.userGroupActionFailed=false;
      },
      error: (err) => {
        this.userGroupActionFailed=true;
        this.errorMessage=err;
      }
    })
  }


  public loadUserGroupFromUserGroups(usergroupId: number): void{
    this.userGroupService.setLoadUserGroupId(usergroupId);
  }

}
