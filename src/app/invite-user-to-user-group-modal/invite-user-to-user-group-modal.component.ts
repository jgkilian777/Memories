import {Component, Input, OnInit} from '@angular/core';
import {UserGroupService} from "../usergroup/user-group.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-invite-user-to-user-group-modal',
  templateUrl: './invite-user-to-user-group-modal.component.html',
  styleUrls: ['./invite-user-to-user-group-modal.component.css']
})
export class InviteUserToUserGroupModalComponent implements OnInit {

  form: any = {
    username: null,
  };
  isUserInviteFailed = false;
  errorMessage = '';

  formSubmitted=false;

  @Input() private usergroupId: number;

  constructor(private usergroupService: UserGroupService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    const { username } = this.form;
    this.usergroupService.inviteUserToUserGroup(username, this.usergroupId)
      .subscribe({
      next: data => {
        this.formSubmitted=true;
        this.isUserInviteFailed = false;
        this.usergroupService.setLoadUserGroupPendingUsers(true);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isUserInviteFailed = true;
      }
    });
  }

}
