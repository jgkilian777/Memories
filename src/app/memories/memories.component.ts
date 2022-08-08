import {Component, Input, OnInit} from '@angular/core';
import {MemoryService} from "../add-memory-to-usergroup/memory.service";
import {MemoryItem} from "../add-memory-to-usergroup/memoryItem";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError, filter, map, mergeMap, switchMap, throwError} from "rxjs";
import {clearLatestFolderIdPath} from "../../main/resources/static/drag-and-drop";
import {RenameMemoryDialog} from "../modify-memories-in-usergroup/modify-memories-in-usergroup.component";
import {MatDialog} from "@angular/material/dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ViewMemoryModalComponent} from "../view-memory-modal/view-memory-modal.component";
import {ViewUserMemoryModalComponent} from "../view-user-memory-modal/view-user-memory-modal.component";

@Component({
  selector: 'app-memories',
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})
export class MemoriesComponent implements OnInit {

  constructor(private memoryService: MemoryService, public dialog: MatDialog, private modalService: NgbModal) { }
  modifyMemoryFailed=false;
  errorMessage="";
  renameModalMemoryId: number;

  public memories: MemoryItem[];
  ngOnInit() {
    this.getMemories();
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




  viewMemory(memoryId: number){
    const modalRef = this.modalService.open(ViewUserMemoryModalComponent);
    // modalRef.componentInstance.usergroupId = usergroupId;
    modalRef.componentInstance.fileId = memoryId;
  }





  deleteMemory(memoryId: number){
    this.memoryService.deleteUserMemory(memoryId)
      .pipe(
        switchMap(success => {
            return this.memoryService.getMemories();
          }
        ),

        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      )

      .subscribe({
        next: (response: MemoryItem[]) => {
          console.log(response);
          this.memories = response;
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
      // map((x) => {console.log(x); console.log("???????????????????"); return x;}),
      filter((newName) => newName!==null&&newName!==undefined),
      switchMap(newName => {
        return this.memoryService.renameMemory(memoryId, newName)
      }),
      switchMap(success => {
          return this.memoryService.getMemories();
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











}
