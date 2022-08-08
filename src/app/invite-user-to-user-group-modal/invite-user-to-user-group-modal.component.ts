import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "../auth/storage.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {catchError, switchMap, throwError} from "rxjs";

@Component({
  selector: 'app-invite-user-to-user-group-modal',
  templateUrl: './invite-user-to-user-group-modal.component.html',
  styleUrls: ['./invite-user-to-user-group-modal.component.css']
})
export class InviteUserToUserGroupModalComponent implements OnInit {

  form: any = {
    username: null,
  };
  isSuccessful = false;
  isUserInviteFailed = false;
  errorMessage = '';

  @Input() private usergroupId: number;

  constructor(public activeModal: NgbActiveModal,  private storageService: StorageService, private usergroupService: UserGroupService) { }


  // constructor(private authService: AuthService) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
    const { username } = this.form;
    this.usergroupService.inviteUserToUserGroup(username, this.usergroupId)
      .subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isUserInviteFailed = false;
        this.usergroupService.setLoadUserGroupPendingUsers(true);
      },
      error: err => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.isUserInviteFailed = true;
      }
    });
  }

}
