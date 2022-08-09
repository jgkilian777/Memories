import { Component, OnInit } from '@angular/core';
import {StorageService} from "../auth/storage.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-create-user-group-modal',
  templateUrl: './create-user-group-modal.component.html',
  styleUrls: ['./create-user-group-modal.component.css']
})
export class CreateUserGroupModalComponent implements OnInit {
  form: any = {
    usergroupname: null,
  };

  formSubmitted=false;
  isUserGroupCreationFailed = false;
  errorMessage = '';
  constructor(private storageService: StorageService, private usergroupService: UserGroupService, public activeModal: NgbActiveModal) { }


  ngOnInit(): void {
  }
  onSubmit(): void {
    const { usergroupname } = this.form;
    const adminUsername = this.storageService.getUser().username;
    this.usergroupService.createUserGroup(adminUsername, usergroupname).subscribe({
      next: data => {
        this.isUserGroupCreationFailed = false;
        this.formSubmitted=true;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isUserGroupCreationFailed = true;
      }
    });
  }

}
