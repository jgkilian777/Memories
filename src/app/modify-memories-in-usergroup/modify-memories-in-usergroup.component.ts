import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MemoryItem} from "../add-memory-to-usergroup/memoryItem";
import {MemoryService} from "../add-memory-to-usergroup/memory.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {StorageService} from "../auth/storage.service";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError, filter, mergeMap, switchMap, throwError} from "rxjs";
import {clearLatestFolderIdPath} from "../../main/resources/static/drag-and-drop";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
// import {MatDialog, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-modify-memories-in-usergroup',
  templateUrl: './modify-memories-in-usergroup.component.html',
  styleUrls: ['./modify-memories-in-usergroup.component.css']
})
export class ModifyMemoriesInUsergroupComponent implements OnInit, OnChanges, AfterViewInit {

  modifyMemoryFailed=false;
  errorMessage="";
  memories: MemoryItem[] = [];
  currentUsername: string;
  alreadyInitialised = false;
  renameModalMemoryId: number;

  @Input() private usergroupId: number;

  constructor(private memoryService: MemoryService, private usergroupService: UserGroupService, private storageService: StorageService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.getMemories();
    this.currentUsername = this.storageService.getUser().username;

  }


  ngAfterViewInit () {

    if (!(typeof this.usergroupId === 'undefined' || this.usergroupId === null || this.alreadyInitialised===true)){
      this.getUserMemoriesInUserGroup();
      this.alreadyInitialised=true;
    }
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (!(typeof this.usergroupId === 'undefined' || this.usergroupId === null || this.alreadyInitialised===true)){

      this.getUserMemoriesInUserGroup();
      this.alreadyInitialised=true;
    }
  }



  public getUserMemoriesInUserGroup(): void {
    this.memoryService.getUserMemoriesInUserGroup(this.usergroupId).subscribe({
      next: (response: MemoryItem[]) => {
        this.memories = response;
        console.log(this.memories);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });

  }


  deleteMemory(memoryId: number){
    this.memoryService.deleteUserMemory(memoryId)
      .pipe(
        switchMap(success => {
            return this.memoryService.getUserMemoriesInUserGroup(this.usergroupId);
          }
        ),
        mergeMap(memories => {
          this.memories = memories;
          console.log("CLEARED LATEST FOLDERID PATH3")
          clearLatestFolderIdPath();
          return this.usergroupService.loadUserGroupFull(this.usergroupId, this.currentUsername);
        }),
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      )

      .subscribe({
      next: (response: any) => {
        console.log(response);
        // this.memories = response;
        this.modifyMemoryFailed=false;
      },
      error: (err: any) => {
        console.log(err);
        this.modifyMemoryFailed=true;
        this.errorMessage=err;
      }

    });
  }

  openRenameMemoryModal(memoryId: number){
    this.renameModalMemoryId = memoryId;

    const dialogRef = this.dialog.open(RenameMemoryDialog, {
      width: '250px',
      // data: {name: this.name, animal: this.animal},
      panelClass: 'rename-dialog',
      backdropClass: 'rename-dialog-backdrop',
      // autoFocus: true,
    });

    dialogRef.afterClosed().pipe(
      filter((newName) => newName!==null&&newName!==undefined),
      switchMap(newName => {

        return this.memoryService.renameMemory(memoryId, newName)
        }),
      switchMap(success => {
          return this.memoryService.getUserMemoriesInUserGroup(this.usergroupId);
        }
      ),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    )
    .subscribe({
      next: (result: MemoryItem[]) => {
        console.log(result);
        this.memories = result;
        this.modifyMemoryFailed=false;
      },
      error: (err) => {
        console.log(err);
        this.modifyMemoryFailed=true;
        this.errorMessage=err;
      }
    });


  }

  renameMemory(memoryId: number, newName: string){
    this.memoryService.renameMemory(memoryId, newName).subscribe({
      next: (response: any) => {
        console.log(response);
        this.modifyMemoryFailed=false;
      },
      error: (err: any) => {
        console.log(err);
        this.modifyMemoryFailed=true;
        this.errorMessage=err;
      }
    });
  }

  removeMemoryFromGroup(memoryId: number){
    this.memoryService.removeMemoryFromUserGroup(memoryId, this.usergroupId)
      .pipe(
        switchMap(success => {
            return this.memoryService.getUserMemoriesInUserGroup(this.usergroupId);
          },
        ),
        mergeMap(memories => {
          this.memories = memories;
          console.log("CLEARED LATEST FOLDERID PATH3")
          clearLatestFolderIdPath();
          return this.usergroupService.loadUserGroupFull(this.usergroupId, this.currentUsername);
        }),
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      )
      .subscribe({
      next: (response: any) => {
        console.log(response);
        // this.memories = response;
        this.modifyMemoryFailed=false;
      },
      error: (err: any) => {
        console.log(err);
        this.modifyMemoryFailed=true;
        this.errorMessage=err;
      }

    });
  }

}


@Component({
  selector: 'rename-memory-dialog',
  templateUrl: 'rename-memory-dialog.html',
})
export class RenameMemoryDialog {
  constructor(public dialogRef: MatDialogRef<RenameMemoryDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}



