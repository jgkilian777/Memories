import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../add-memory-to-usergroup/memory.service";
import {MemoryItem} from "../add-memory-to-usergroup/memoryItem";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError, filter, switchMap, throwError} from "rxjs";
import {RenameMemoryDialog} from "../modify-memories-in-usergroup/modify-memories-in-usergroup.component";
import {MatDialog} from "@angular/material/dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ViewUserMemoryModalComponent} from "../view-user-memory-modal/view-user-memory-modal.component";
import {CreateMemoryModalComponent} from "../create-memory-modal/create-memory-modal.component";
import {StorageService} from "../auth/storage.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-memories',
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})
export class MemoriesComponent implements OnInit {

  constructor(private memoryService: MemoryService, public dialog: MatDialog, private modalService: NgbModal, private storageService: StorageService) { }
  modifyMemoryFailed=false;
  errorMessage="";
  getMemoriesFailed=false;
  getMemoriesError="";
  isLoggedIn = false;
  datePipe = new DatePipe('en-US');

  public memories: MemoryItem[];
  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.getMemories();
    }

  }

  public getMemories(): void {
    this.memoryService.getMemories().subscribe({
      next: (response: MemoryItem[]) => {
        this.memories = response;
        this.getMemoriesFailed=false;
      },
      error: (error: HttpErrorResponse) => {
        this.getMemoriesError = error.message;
        this.getMemoriesFailed=true;
      }
    });

  }

  formatDate(dateTime: number){
    return this.datePipe.transform(dateTime, 'd MMM, y, h:mm:ss a');
  }

  openCreateMemoryModal() {
    const modalRef = this.modalService.open(CreateMemoryModalComponent);
    modalRef.componentInstance.memories = this.memories;
    modalRef.componentInstance.memoriesChange.subscribe(
      (newMemories: MemoryItem[]) => {
        this.memories = newMemories;
      }
    )
  }


  viewMemory(memoryId: number){
    const modalRef = this.modalService.open(ViewUserMemoryModalComponent);
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
          return throwError(error);
        })
      )
      .subscribe({
        next: (response: MemoryItem[]) => {
          this.memories = response;
          this.modifyMemoryFailed=false;
        },
        error: (err: any) => {
          this.modifyMemoryFailed=true;
          this.errorMessage=err.message;
        }
      });
  }

  openRenameMemoryModal(memoryId: number){
    const dialogRef = this.dialog.open(RenameMemoryDialog, {
      width: '250px',
      panelClass: 'rename-dialog',
      backdropClass: 'rename-dialog-backdrop',
    });

    dialogRef.afterClosed().pipe(
      filter((newName) => newName!==null&&newName!==undefined),
      switchMap(newName => {
        return this.memoryService.renameMemory(memoryId, newName)
      }),
      switchMap(success => {
          return this.memoryService.getMemories();
        }
      ),
      catchError(error => {
        return throwError(error);
      })
    )
      .subscribe({
        next: (result: MemoryItem[]) => {
          this.memories = result;
          this.modifyMemoryFailed=false;
        },
        error: (err) => {
          this.modifyMemoryFailed=true;
          this.errorMessage=err.message;
        }
      });

  }

}
