import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {catchError, switchMap, throwError} from "rxjs";
import {UserInGroupView} from "../usergroup/userInGroupView";
import {HttpErrorResponse} from "@angular/common/http";
import {PendingUserInGroupView} from "../usergroup/pendingUserInGroupView";
import {StorageService} from "../auth/storage.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {UsergroupsService} from "../usergroups/usergroups.service";

@Component({
  selector: 'app-user-group-users-tab',
  templateUrl: './user-group-users-tab.component.html',
  styleUrls: ['./user-group-users-tab.component.css']
})
export class UserGroupUsersTabComponent implements OnInit, AfterViewInit {

  userGroupUserActionFailed=false;
  userGroupUserActionErrorMessage="";

  @Input() requiredUserGroupId: number | null;
  @Input() usersInGroup: UserInGroupView[];
  @Input() pendingUsersInGroup: PendingUserInGroupView[];
  @Input() selectedIndex: number;
  @Input() userGroupAdminUsername: string;

  @Output() requiredUserGroupIdChange = new EventEmitter<number>();
  @Output() usersInGroupChange = new EventEmitter<UserInGroupView[]>();
  @Output() pendingUsersInGroupChange = new EventEmitter<PendingUserInGroupView[]>();
  @Output() selectedIndexChange = new EventEmitter<number>();
  @Output() userGroupAdminUsernameChange = new EventEmitter<string>();

  constructor(private storageService: StorageService, private userGroupService: UserGroupService, private userGroupsService: UsergroupsService, private changeDetectorRef: ChangeDetectorRef) { }

  isLoggedIn: boolean;
  currentUsername: string;
  allowAllDebug=false;


  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.currentUsername = this.storageService.getUser().username;
    }
  }

  ngAfterViewInit () {
    this.selectedIndexChange.emit(this.selectedIndex-1);

  }

  ngOnDestroy(): void {
    // this.loadUserGroupFullObservable$.unsubscribe();
    this.loadUserGroupPendingUsersObservable$.unsubscribe();
    this.loadUserGroupUsersObservable$.unsubscribe();
  }


  loadUserGroupPendingUsersObservable$ = this.userGroupService.getLoadUserGroupPendingUsers().pipe(
    switchMap(success => {
        if (this.requiredUserGroupId===null){
          throw throwError(() => new Error('required usergroupId is null somehow'));
        }
        return this.userGroupService.getPendingUserGroupUsers(this.requiredUserGroupId);
      }

    ),
    catchError(error => {
      console.log(error);
      return throwError(error);
    })

  ).subscribe(
    {
      next: (response: PendingUserInGroupView[]) => {
        this.pendingUsersInGroup = response;
        this.pendingUsersInGroupChange.emit(this.pendingUsersInGroup);
        console.log(this.pendingUsersInGroup);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    }
  );

  loadUserGroupUsersObservable$ = this.userGroupService.getLoadUserGroupUsers().pipe(
    switchMap(success => {
        if (this.requiredUserGroupId===null){
          throw throwError(() => new Error('required usergroupId is null somehow'));
        }
        return this.userGroupService.getUserGroupUsers(this.requiredUserGroupId);
      }

    ),
    catchError(error => {
      console.log(error);
      return throwError(error);
    })

  ).subscribe(
    {
      next: (response: UserInGroupView[]) => {
        this.usersInGroup = response;
        this.usersInGroupChange.emit(this.usersInGroup);
        console.log(this.usersInGroup);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    }
  );


  cancelPendingUserInvite(username: string){
    if (this.requiredUserGroupId!==null){
      this.userGroupService.cancelPendingUserInvite(username, this.requiredUserGroupId).pipe(
        switchMap( response =>
          {
            if (this.requiredUserGroupId===null){
              throw throwError(() => new Error('required usergroupId is null somehow'));
            }
            return this.userGroupService.getPendingUserGroupUsers(this.requiredUserGroupId);
          }
        ),
        catchError(error => {
          console.log(error);
          this.userGroupUserActionFailed=true;
          this.userGroupUserActionErrorMessage=error;
          return throwError(error);
        }))
        .subscribe({
          next: (pendingUsersInUserGroup) => {
            this.userGroupUserActionFailed=false;
            this.pendingUsersInGroup = pendingUsersInUserGroup;
            this.pendingUsersInGroupChange.emit(this.pendingUsersInGroup);

          },
          error: (err) => {
            this.userGroupUserActionFailed=true;
            this.userGroupUserActionErrorMessage=err;
            console.log(err);
          }
        })
    }
  }

  removeUserFromUserGroup(username: string){
    if (this.requiredUserGroupId!==null){
      this.userGroupService.removeUserFromUserGroup(username, this.requiredUserGroupId).pipe(

        switchMap( response =>
          {
            if (this.requiredUserGroupId===null){
              throw throwError(() => new Error('required usergroupId is null somehow'));
            }
            return this.userGroupService.getUserGroupUsers(this.requiredUserGroupId);
          }
        ),
        catchError(error => {
          console.log(error);
          this.userGroupUserActionFailed=true;
          this.userGroupUserActionErrorMessage=error;
          return throwError(error);
        }))
        .subscribe({
          next: (usersInUserGroup) => {
            this.userGroupUserActionFailed=false;
            this.usersInGroup = usersInUserGroup;
            this.usersInGroupChange.emit(this.usersInGroup);

          },
          error: (err) => {
            this.userGroupUserActionFailed=true;
            this.userGroupUserActionErrorMessage=err;
            console.log(err);
          }
        })
    }
  }


}
