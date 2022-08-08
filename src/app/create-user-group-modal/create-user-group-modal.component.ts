import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../auth/auth.service";
import {StorageService} from "../auth/storage.service";
import {UserGroupService} from "../usergroup/user-group.service";

@Component({
  selector: 'app-create-user-group-modal',
  templateUrl: './create-user-group-modal.component.html',
  styleUrls: ['./create-user-group-modal.component.css']
})
export class CreateUserGroupModalComponent implements OnInit {
  form: any = {
    usergroupname: null,
  };
  isSuccessful = false;
  isUserGroupCreationFailed = false;
  errorMessage = '';
  constructor(public activeModal: NgbActiveModal,  private storageService: StorageService, private usergroupService: UserGroupService) { }


  // constructor(private authService: AuthService) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
    const { usergroupname } = this.form;
    const adminUsername = this.storageService.getUser().username;
    this.usergroupService.createUserGroup(adminUsername, usergroupname).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isUserGroupCreationFailed = false;
      },
      error: err => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.isUserGroupCreationFailed = true;
      }
    });
  }

}
