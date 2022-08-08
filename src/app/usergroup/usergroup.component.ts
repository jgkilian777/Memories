import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CreateUserGroupModalComponent} from "../create-user-group-modal/create-user-group-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  CreateAndAddMemoryToUsergroupModalComponent
} from "../create-and-add-memory-to-usergroup-modal/create-and-add-memory-to-usergroup-modal.component";
import {StorageService} from "../auth/storage.service";
import {UserGroupService} from "./user-group.service";
import * as $ from "jquery";
import {catchError, filter, map, mergeMap, Observable, switchMap, throwError} from "rxjs";
import {clearLatestFolderIdPath} from "../../main/resources/static/drag-and-drop";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {UserInGroupView} from "./userInGroupView";
import {PendingUserInGroupView} from "./pendingUserInGroupView";
import {UserGroup} from "../usergroups/userGroup";
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
  isSuccessful = false;
  isSaveJSONFailed = false;
  errorMessage = '';
  isLoggedIn = false;
  roles: string[] = [];
  userGroupLoadFailed=false;
  requiredUserGroupId: number | null;
  userGroupAdminUsername: string;
  // userGroupUserActionFailed=false;
  // userGroupUserActionErrorMessage="";

  doneTabInit=false;

  usersInGroup: UserInGroupView[] = [];
  pendingUsersInGroup: PendingUserInGroupView[] = [];


  currentUsername: string;
  allowAllDebug=false;

  selectedIndex=1;

  constructor(private modalService: NgbModal, private storageService: StorageService, private userGroupService: UserGroupService, private userGroupsService: UsergroupsService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;

      this.currentUsername = this.storageService.getUser().username;


    }
  }

  // ngAfterViewInit() {
  //   this.userGroupService.loadUserGroupFull(this.requiredUserGroup)
  // }

  ngOnDestroy(): void {
    this.loadUserGroupFullObservable$.unsubscribe();
    // this.loadUserGroupPendingUsersObservable$.unsubscribe();
    // this.loadUserGroupUsersObservable$.unsubscribe();
  }

  onIndexChange(currIndex: number){
    console.log(currIndex);
    console.log("index changed");
    this.changeDetectorRef.detectChanges();
    // this.changeDetectorRef.markForCheck();
    // if (currIndex===0){
    //   this.doneTabInit=true;
    // }
  }

  debugButton(){
    console.log(this.selectedIndex);
  }

  loadUserGroupFullObservable$ = this.userGroupService.getLoadUserGroupId().pipe(
    switchMap(userGroupId => {
      console.log("GETTING LOADUSERGROUPID");
      console.log(userGroupId);
      this.requiredUserGroupId = userGroupId;

      return this.userGroupService.loadUserGroupFull(userGroupId, this.currentUsername);
      }

    ),
    map(response => {
      this.userGroupAdminUsername = response.adminUsername;
      return response;
    }),
    catchError(error => {
      console.log(error);
      return throwError(error);
    })

    ).subscribe(
    {
      next: (userGroupId: number) => {
        this.userGroupLoadFailed=false;
      },
      error: (err) => {
        this.userGroupLoadFailed=true;
        this.errorMessage=err;
        console.log(err);
      }
    }
  );

  // loadUserGroupPendingUsersObservable$ = this.userGroupService.getLoadUserGroupPendingUsers().pipe(
  //   switchMap(success => {
  //       if (this.requiredUserGroupId===null){
  //         throw throwError(() => new Error('required usergroupId is null somehow'));
  //       }
  //       return this.userGroupService.getPendingUserGroupUsers(this.requiredUserGroupId);
  //     }
  //
  //   ),
  //   catchError(error => {
  //     console.log(error);
  //     return throwError(error);
  //   })
  //
  // ).subscribe(
  //   {
  //     next: (response: PendingUserInGroupView[]) => {
  //       this.pendingUsersInGroup = response;
  //       console.log(this.pendingUsersInGroup);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   }
  // );



  // loadUserGroupUsersObservable$ = this.userGroupService.getLoadUserGroupUsers().pipe(
  //   switchMap(success => {
  //       if (this.requiredUserGroupId===null){
  //         throw throwError(() => new Error('required usergroupId is null somehow'));
  //       }
  //       return this.userGroupService.getUserGroupUsers(this.requiredUserGroupId);
  //     }
  //
  //   ),
  //   catchError(error => {
  //     console.log(error);
  //     return throwError(error);
  //   })
  //
  // ).subscribe(
  //   {
  //     next: (response: UserInGroupView[]) => {
  //       this.usersInGroup = response;
  //       console.log(this.usersInGroup);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   }
  // );


  myTabSelectedTabChange(changeEvent: MatTabChangeEvent) {
    if (!this.doneTabInit){

      if (this.selectedIndex==0){
        this.doneTabInit=true;
      } else {
        this.selectedIndex-=1;
      }
    }
    else if (this.doneTabInit){
      console.log("changeEvent BELOW BELOW BELOW");
      console.log(changeEvent);
      if (changeEvent.index===0 && this.requiredUserGroupId!==null){
        this.userGroupService.loadUserGroupFull(this.requiredUserGroupId, this.currentUsername).subscribe(
          {
            next: (userGroupId: number) => {
              this.userGroupLoadFailed=false;
            },
            error: (err) => {
              this.userGroupLoadFailed=true;
              this.errorMessage=err;
              console.log(err);
            }
          }
        );
      } else if (changeEvent.index===1 && this.requiredUserGroupId!==null){
        this.userGroupService.getUserGroupUsers(this.requiredUserGroupId).subscribe({
          next: (response: UserInGroupView[]) => {
            this.usersInGroup = response;
            console.log(this.usersInGroup);
          },
          error: (error: HttpErrorResponse) => {
            alert(error.message);
          }
        });

        this.userGroupService.getPendingUserGroupUsers(this.requiredUserGroupId).subscribe({
          next: (response: PendingUserInGroupView[]) => {
            this.pendingUsersInGroup = response;
            console.log(this.pendingUsersInGroup);
          },
          error: (error: HttpErrorResponse) => {
            alert(error.message);
          }
        });



      }
    }
  }

  // cancelPendingUserInvite(username: string){
  //   if (this.requiredUserGroupId!==null){
  //     this.userGroupService.cancelPendingUserInvite(username, this.requiredUserGroupId).pipe(
  //       switchMap( response =>
  //         {
  //           if (this.requiredUserGroupId===null){
  //             throw throwError(() => new Error('required usergroupId is null somehow'));
  //           }
  //           return this.userGroupService.getPendingUserGroupUsers(this.requiredUserGroupId);
  //         }
  //       ),
  //       catchError(error => {
  //         console.log(error);
  //         this.userGroupUserActionFailed=true;
  //         this.userGroupUserActionErrorMessage=error;
  //         return throwError(error);
  //       }))
  //       .subscribe({
  //       next: (pendingUsersInUserGroup) => {
  //         this.userGroupUserActionFailed=false;
  //         this.pendingUsersInGroup = pendingUsersInUserGroup;
  //
  //       },
  //       error: (err) => {
  //         this.userGroupUserActionFailed=true;
  //         this.userGroupUserActionErrorMessage=err;
  //         console.log(err);
  //       }
  //     })
  //   }
  // }
  //
  // removeUserFromUserGroup(username: string){
  //   if (this.requiredUserGroupId!==null){
  //     this.userGroupService.removeUserFromUserGroup(username, this.requiredUserGroupId).pipe(
  //
  //       switchMap( response =>
  //         {
  //           if (this.requiredUserGroupId===null){
  //             throw throwError(() => new Error('required usergroupId is null somehow'));
  //           }
  //           return this.userGroupService.getUserGroupUsers(this.requiredUserGroupId);
  //         }
  //       ),
  //       catchError(error => {
  //         console.log(error);
  //         this.userGroupUserActionFailed=true;
  //         this.userGroupUserActionErrorMessage=error;
  //         return throwError(error);
  //       }))
  //       .subscribe({
  //         next: (usersInUserGroup) => {
  //           this.userGroupUserActionFailed=false;
  //           this.usersInGroup = usersInUserGroup;
  //
  //         },
  //         error: (err) => {
  //           this.userGroupUserActionFailed=true;
  //           this.userGroupUserActionErrorMessage=err;
  //           console.log(err);
  //         }
  //       })
  //   }
  // }







  // loadUserGroupResponseObservable$ = this.userGroupService.getLoadUserGroupResponse().subscribe(
  //   {
  //     next: (loadUserGroupResponse) => {
  //       this.errorMessage = loadUserGroupResponse.err;
  //       this.userGroupLoadFailed = !loadUserGroupResponse.loadUserGroupSuccess;
  //       console.log(loadUserGroupResponse);
  //     },
  //     error: (err) =>{
  //       console.log(err);
  //     }
  //
  //   }
  // );






  // public openCreateAndAddMemoriesModal(): void {
  //   const modalRef = this.modalService.open(CreateAndAddMemoryToUsergroupModalComponent);
  //
  // }


  // closeAndRenameUserGroup(newName: string){
  //
  // }

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


