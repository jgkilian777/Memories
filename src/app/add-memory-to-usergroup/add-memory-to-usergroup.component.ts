import {Component, Input, OnInit} from '@angular/core';
import {MemoryItem} from "./memoryItem";
import {HttpErrorResponse} from "@angular/common/http";
import {MemoryService} from "./memory.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {StorageService} from "../auth/storage.service";
import {catchError, mergeMap, throwError} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-add-memory-to-usergroup',
  templateUrl: './add-memory-to-usergroup.component.html',
  styleUrls: ['./add-memory-to-usergroup.component.css']
})
export class AddMemoryToUsergroupComponent implements OnInit {
  currentUsername: string;
  constructor(private memoryService: MemoryService, private usergroupService: UserGroupService, private storageService: StorageService) { }

  isAddedToUserGroupFailed = false;
  getMemoriesError="";
  isGetMemoriesFailed = false;
  addedToUserGroupError="";
  datePipe = new DatePipe('en-US');

  public memories: MemoryItem[];
  ngOnInit() {
    this.getMemories();
    this.currentUsername = this.storageService.getUser().username;

  }

  @Input() public usergroupId: number;

  public getMemories(): void {
    this.memoryService.getMemories().subscribe({
      next: (response: MemoryItem[]) => {
        this.memories = response;
        this.isGetMemoriesFailed=false;
      },
      error: (error: HttpErrorResponse) => {
        this.getMemoriesError=error.message;
        this.isGetMemoriesFailed=true;
      }
    });

  }

  formatDate(dateTime: number){
    return this.datePipe.transform(dateTime, 'd MMM, y, h:mm:ss a');
  }

  addMemoryToUserGroup(memoryItem: MemoryItem){
    const addMemoryToUserGroupObs$ = this.memoryService.addMemoryToUsergroup(this.usergroupId, memoryItem.id);

    addMemoryToUserGroupObs$.pipe(

      mergeMap(success => {
        return this.usergroupService.loadUserGroupFull(this.usergroupId, this.currentUsername);
      }),
      catchError(error => {
        this.isAddedToUserGroupFailed = true;
        this.addedToUserGroupError = error;
        return throwError(error);
      })

    ).subscribe(
      {
        next: response => {
          this.isAddedToUserGroupFailed = false;
        }, error: err => {
          this.isAddedToUserGroupFailed = true;
          this.addedToUserGroupError = err;
        }
      }
    )


  }

}
