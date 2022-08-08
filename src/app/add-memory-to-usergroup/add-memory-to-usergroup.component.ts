import {Component, Input, OnInit} from '@angular/core';
import {MemoryItem} from "./memoryItem";
import {UserGroup} from "../usergroups/userGroup";
import {HttpErrorResponse} from "@angular/common/http";
import {MemoryService} from "./memory.service";
import {UsergroupsService} from "../usergroups/usergroups.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {StorageService} from "../auth/storage.service";

@Component({
  selector: 'app-add-memory-to-usergroup',
  templateUrl: './add-memory-to-usergroup.component.html',
  styleUrls: ['./add-memory-to-usergroup.component.css']
})
export class AddMemoryToUsergroupComponent implements OnInit {
  currentUsername: string;
  constructor(private memoryService: MemoryService, private usergroupService: UserGroupService, private storageService: StorageService) { }

  isAddedToUserGroupFailed = false;
  errorMessage2="";
  isAddedToUserGroupSuccessful = false;

  public memories: MemoryItem[];
  isLoggedIn = false;
  ngOnInit() {
    this.getMemories();
    this.currentUsername = this.storageService.getUser().username;

  }

  @Input() public usergroupId: number;
  // @Input() public usergroup: UserGroup;

  public getMemories(): void {
    this.memoryService.getMemories().subscribe({
      next: (response: MemoryItem[]) => {
        this.memories = response;
        console.log(this.memories);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });

  }


  addMemoryToUserGroup(memoryItem: MemoryItem){
    this.memoryService.addMemoryToUsergroup(this.usergroupId, memoryItem.id, this, this.currentUsername);
  }

}
