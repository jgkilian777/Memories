import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "../auth/storage.service";
import {UserGroupService} from "./user-group.service";
import {catchError, map, switchMap, throwError} from "rxjs";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {UserInGroupView} from "./userInGroupView";
import {PendingUserInGroupView} from "./pendingUserInGroupView";
import {HttpErrorResponse} from "@angular/common/http";
import {UsergroupsService} from "../usergroups/usergroups.service";
import {MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-usergroup',
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UsergroupComponent implements OnInit {
  errorMessage = '';
  isLoggedIn = false;
  roles: string[] = [];
  userGroupLoadFailed=false;
  requiredUserGroupId: number | null;
  userGroupAdminUsername: string;

  doneTabInit=false;

  usersInGroup: UserInGroupView[] = [];
  pendingUsersInGroup: PendingUserInGroupView[] = [];

  currentUsername: string;
  allowAllDebug=false;

  selectedIndex=1;

  constructor(private modalService: NgbModal, private storageService: StorageService, private userGroupService: UserGroupService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.currentUsername = this.storageService.getUser().username;
    }
  }

  ngOnDestroy(): void {
    this.loadUserGroupFullObservable$.unsubscribe();
  }

  onIndexChange(currIndex: number){
    this.changeDetectorRef.detectChanges();
  }

  loadUserGroupFullObservable$ = this.userGroupService.getLoadUserGroupId().pipe(
    switchMap(userGroupId => {
      this.requiredUserGroupId = userGroupId;
      return this.userGroupService.loadUserGroupFull(userGroupId, this.currentUsername);
    }),
    map(response => {
      this.userGroupAdminUsername = response.adminUsername;
      return response;
    }),
    catchError(error => {
      return throwError(error);
    })

    ).subscribe(
    {
      next: (userGroupId: number) => {
        this.userGroupLoadFailed=false;
      },
      error: (err) => {
        this.userGroupLoadFailed=true;
        this.errorMessage=err.message;
      }
    }
  );


  myTabSelectedTabChange(changeEvent: MatTabChangeEvent) {
    if (!this.doneTabInit){
      if (this.selectedIndex==0){
        this.doneTabInit=true;
      } else {
        this.selectedIndex-=1;
      }
    }
    else if (this.doneTabInit){
      if (changeEvent.index===0 && this.requiredUserGroupId!==null){
        this.userGroupService.loadUserGroupFull(this.requiredUserGroupId, this.currentUsername).subscribe(
          {
            next: (userGroupId: number) => {
              this.userGroupLoadFailed=false;
            },
            error: (err) => {
              this.userGroupLoadFailed=true;
              this.errorMessage=err.message;
            }
          }
        );
      } else if (changeEvent.index===1 && this.requiredUserGroupId!==null){
        this.userGroupService.getUserGroupUsers(this.requiredUserGroupId).subscribe({
          next: (response: UserInGroupView[]) => {
            this.usersInGroup = response;
          },
          error: (error: HttpErrorResponse) => {
            alert(error.message);
          }
        });

        this.userGroupService.getPendingUserGroupUsers(this.requiredUserGroupId).subscribe({
          next: (response: PendingUserInGroupView[]) => {
            this.pendingUsersInGroup = response;
          },
          error: (error: HttpErrorResponse) => {
            alert(error.message);
          }
        });
      }
    }
  }
}



@Component({
  selector: 'rename-usergroup-dialog',
  templateUrl: 'rename-usergroup-dialog.html',
})
export class RenameUserGroupDialog {
  constructor(public dialogRef: MatDialogRef<RenameUserGroupDialog>) {}


  onNoClick(): void {
    this.dialogRef.close();
  }
}


