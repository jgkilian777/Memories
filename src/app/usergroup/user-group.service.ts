import {Injectable} from '@angular/core';
import {catchError, filter, map, mergeMap, Observable, Subject, switchMap, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserGroup} from "../usergroups/userGroup";
import {UserGroupFull} from "../usergroups/userGroupFull";
import {
  clearLatestFolderIdPath,
  getLatestFolderIdPath,
  getLatestJSON,
  initUserGroupView,
  loadTreeNode,
  toggleFolderDeposit,
  clearUserGroupView
} from "../../main/resources/static/drag-and-drop";

import {
  CreateAndAddMemoryToUsergroupModalComponent
} from "../create-and-add-memory-to-usergroup-modal/create-and-add-memory-to-usergroup-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddMemoryToUsergroupComponent} from "../add-memory-to-usergroup/add-memory-to-usergroup.component";
import {UserInGroupView} from "./userInGroupView";
import {PendingUserInGroupView} from "./pendingUserInGroupView";
import {InviteUserToUserGroupRequest} from "./inviteUserToUserGroupRequest";
import {
  InviteUserToUserGroupModalComponent
} from "../invite-user-to-user-group-modal/invite-user-to-user-group-modal.component";
import {StorageService} from "../auth/storage.service";
import {MemoryService} from "../add-memory-to-usergroup/memory.service";
import {
  ModifyMemoriesInUsergroupComponent
} from "../modify-memories-in-usergroup/modify-memories-in-usergroup.component";
import {MatDialog} from "@angular/material/dialog";
import {RenameUserGroupDialog} from "./usergroup.component";

const apiServerUrl = 'http://localhost:8080/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
};


@Injectable({
  providedIn: 'root'
})

export class UserGroupService {

  private loadUserGroupIdSubject:  Subject<number> = new Subject<number>();

  setLoadUserGroupId(userGroupId: number){
    this.loadUserGroupIdSubject.next(userGroupId);
  }
  getLoadUserGroupId(): Observable<number>{
    return this.loadUserGroupIdSubject;
  }

  private loadUserGroupPendingUsersSubject:  Subject<boolean> = new Subject<boolean>();

  setLoadUserGroupPendingUsers(junk: boolean){
    this.loadUserGroupPendingUsersSubject.next(junk);
  }
  getLoadUserGroupPendingUsers(): Observable<boolean>{
    return this.loadUserGroupPendingUsersSubject;
  }

  private loadUserGroupsSubject:  Subject<boolean> = new Subject<boolean>();

  setLoadUserGroups(junk: boolean){
    this.loadUserGroupsSubject.next(junk);
  }
  getLoadUserGroups(): Observable<boolean>{
    return this.loadUserGroupsSubject;
  }

  constructor(private http: HttpClient, private modalService: NgbModal, private storageService: StorageService, private memoryService: MemoryService, public dialog: MatDialog) { }

  public loadUserGroupFull(usergroupId: number, currUserName: string): Observable<any> {
    this.unHookButtons();
    clearLatestFolderIdPath();
    return this.loadUserGroup(usergroupId, currUserName).pipe(
      map(response => {
        this.hookButtons(usergroupId);
        return response;
      })
    )
  }

  public loadUserGroup(usergroupId: number, currUserName: string): Observable<any> {

    return this.http.get<UserGroupFull>(apiServerUrl+'/usergroups/'+usergroupId).pipe(

      map(response => {
        let userCanDrag: boolean;
        if (currUserName===response.adminUsername){
          userCanDrag=true;
        } else {
          userCanDrag=false;
        }
        initUserGroupView(JSON.parse(response.directoryTreeJSON), response.name, userCanDrag, this.memoryService.openFileFromAngular.bind(this.memoryService), usergroupId);
        return response;
      })
    );
  }

  public createUserGroup(adminUsername: string, usergroupName: string): Observable<any> {
    return this.http.post(
      apiServerUrl + '/usergroups/createusergroup',
      {
        adminUsername,
        usergroupName,
      },
      httpOptions
    );
  }

  public acceptUserGroupInvite(usergroupId: number){
    return this.http.post(
      apiServerUrl + '/usergroups/acceptusergroupinvite',
        usergroupId,
      httpOptions
    );
  }

  public declineUserGroupInvite(usergroupId: number){
    return this.http.post(
      apiServerUrl + '/usergroups/declineusergroupinvite',
        usergroupId,
      httpOptions
    );
  }

  public cancelPendingUserInvite(username: string, usergroupId: number){
    let cancelPendingUserFromUserGroupRequest: InviteUserToUserGroupRequest = {username:username, usergroupId:usergroupId}
    return this.http.post(
      apiServerUrl + '/usergroups/removeinviteuser',
      cancelPendingUserFromUserGroupRequest,
      httpOptions
    );
  }

  public inviteUserToUserGroup(username: string, usergroupId: number){
    let inviteUserToUserGroupRequest: InviteUserToUserGroupRequest = {username:username, usergroupId:usergroupId}
    return this.http.post(
      apiServerUrl + '/usergroups/inviteuser',
        inviteUserToUserGroupRequest,
      httpOptions
    );
  }

  public removeUserFromUserGroup(username: string, usergroupId: number){
    let removeUserToUserGroupRequest: InviteUserToUserGroupRequest = {username:username, usergroupId:usergroupId}
    return this.http.post(
      apiServerUrl + '/usergroups/removeuser',
      removeUserToUserGroupRequest,
      httpOptions
    );
  }


  public unHookButtons(): void {
    let saveJSONbutton = document.getElementById('saveJSONbutton');
    let toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');
    let createFolderButton = document.getElementById('createFolderButton');
    let renameUserGroupButton = document.getElementById('renameUserGroupButton');
    let addMemoriesButton = document.getElementById('addMemoriesButton');
    let createAndAddMemoriesButton = document.getElementById('createAndAddMemoriesButton');
    let modifyMemoriesForUserGroupButton = document.getElementById('modifyMemoriesForUserGroupButton')
    let inviteUserToUserGroupButton = document.getElementById('inviteUserToUserGroupButton');
    let deleteUserGroupButton = document.getElementById('deleteUserGroupButton');
    if (saveJSONbutton !== null && deleteUserGroupButton !== null && renameUserGroupButton !== null && toggleFolderDepositButton !== null && createFolderButton !== null && addMemoriesButton !== null && createAndAddMemoriesButton !== null && inviteUserToUserGroupButton !== null && modifyMemoriesForUserGroupButton !== null){
      saveJSONbutton.removeAttribute("data-usergroupId");
      saveJSONbutton.removeEventListener('click', this.saveJSONBind);

      toggleFolderDepositButton.removeEventListener('click', toggleFolderDeposit);
      createFolderButton.removeEventListener('click', this.createFolderBind);

      addMemoriesButton.removeAttribute("data-usergroupId");
      addMemoriesButton.removeEventListener('click', this.openAddMemoriesModalBind);

      createAndAddMemoriesButton.removeAttribute("data-usergroupId");
      createAndAddMemoriesButton.removeEventListener('click', this.openCreateAndAddMemoriesModalBind);

      renameUserGroupButton.removeAttribute("data-usergroupId");
      renameUserGroupButton.removeEventListener('click', this.openRenameUserGroupModalBind);

      modifyMemoriesForUserGroupButton.removeAttribute("data-usergroupId");
      modifyMemoriesForUserGroupButton.removeEventListener('click', this.openModifyMemoriesForUserGroupBind);

      inviteUserToUserGroupButton.removeAttribute("data-usergroupId");
      inviteUserToUserGroupButton.removeEventListener('click', this.openInviteUserToUserGroupModalBind);

      deleteUserGroupButton.removeAttribute("data-usergroupId");
      deleteUserGroupButton.removeEventListener('click', this.deleteUserGroupBind);

    } else {
      throw 'a button is missing';
    }
  }

  saveJSONBind: any | null;
  createFolderBind: any | null;
  openAddMemoriesModalBind: any | null;
  openCreateAndAddMemoriesModalBind: any | null;
  openInviteUserToUserGroupModalBind: any | null;
  openModifyMemoriesForUserGroupBind: any | null;
  openRenameUserGroupModalBind: any | null;
  deleteUserGroupBind: any | null;


  public hookButtons(usergroupId: number): void{
    let saveJSONbutton = document.getElementById('saveJSONbutton');
    let toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');
    let createFolderButton = document.getElementById('createFolderButton');
    let renameUserGroupButton = document.getElementById('renameUserGroupButton');
    let addMemoriesButton = document.getElementById('addMemoriesButton');
    let createAndAddMemoriesButton = document.getElementById('createAndAddMemoriesButton');
    let inviteUserToUserGroupButton = document.getElementById('inviteUserToUserGroupButton');
    let modifyMemoriesForUserGroupButton = document.getElementById('modifyMemoriesForUserGroupButton');
    let deleteUserGroupButton = document.getElementById('deleteUserGroupButton');
    if (saveJSONbutton !== null && deleteUserGroupButton !== null && renameUserGroupButton !== null && toggleFolderDepositButton !== null && createFolderButton !== null && addMemoriesButton !== null && createAndAddMemoriesButton !== null && inviteUserToUserGroupButton !== null && modifyMemoriesForUserGroupButton!== null){

      this.saveJSONBind = this.saveJSON.bind(this);
      this.createFolderBind =  this.createFolder.bind(this);
      this.openAddMemoriesModalBind = this.openAddMemoriesModal.bind(this);
      this.openCreateAndAddMemoriesModalBind = this.openCreateAndAddMemoriesModal.bind(this);
      this.openInviteUserToUserGroupModalBind = this.openInviteUserToUserGroupModal.bind(this);
      this.openModifyMemoriesForUserGroupBind = this.openModifyMemoriesForUserGroupModal.bind(this);
      this.openRenameUserGroupModalBind = this.openRenameUserGroupModal.bind(this);
      this.deleteUserGroupBind = this.deleteUserGroup.bind(this);

      saveJSONbutton.setAttribute("data-usergroupId", String(usergroupId));
      saveJSONbutton.addEventListener('click', this.saveJSONBind);

      toggleFolderDepositButton.addEventListener('click', toggleFolderDeposit);
      createFolderButton.addEventListener('click', this.createFolderBind);

      addMemoriesButton.setAttribute("data-usergroupId", String(usergroupId));
      addMemoriesButton.addEventListener('click', this.openAddMemoriesModalBind);

      createAndAddMemoriesButton.setAttribute("data-usergroupId", String(usergroupId));
      createAndAddMemoriesButton.addEventListener('click', this.openCreateAndAddMemoriesModalBind);

      modifyMemoriesForUserGroupButton.setAttribute("data-usergroupId", String(usergroupId));
      modifyMemoriesForUserGroupButton.addEventListener('click', this.openModifyMemoriesForUserGroupBind);

      renameUserGroupButton.setAttribute("data-usergroupId", String(usergroupId));
      renameUserGroupButton.addEventListener('click', this.openRenameUserGroupModalBind);

      inviteUserToUserGroupButton.setAttribute("data-usergroupId", String(usergroupId));
      inviteUserToUserGroupButton.addEventListener('click', this.openInviteUserToUserGroupModalBind);

      deleteUserGroupButton.setAttribute("data-usergroupId", String(usergroupId));
      deleteUserGroupButton.addEventListener('click', this.deleteUserGroupBind);

    } else {
      throw 'a button is missing';
    }
  }


  public getUserGroupUsers(usergroupId: number): Observable<UserInGroupView[]> {
    return this.http.get<UserInGroupView[]>(apiServerUrl+'/usergroups/'+usergroupId+'/users')
  }

  public getPendingUserGroupUsers(usergroupId: number): Observable<PendingUserInGroupView[]> {
    return this.http.get<PendingUserInGroupView[]>(apiServerUrl+'/usergroups/'+usergroupId+'/pendingusers')
  }

  private saveJSON(e: any): void{
    let usergroupId = Number(e.target.getAttribute("data-usergroupId"));
    let dirTreeJSON = getLatestJSON();
    let response: Observable<any> = this.http.post<UserGroup>(
      apiServerUrl + '/usergroups/savedirstructure/' + usergroupId,
      {
        dirTreeJSON,
      },
      httpOptions
      ).pipe(
        mergeMap( response2 => {
          clearLatestFolderIdPath();
          return this.loadUserGroup(usergroupId, this.storageService.getUser().username);
          }
        ),
      catchError(error => {
        return throwError(error);
      })
      )
    response.subscribe({
      next: data => {
      },
      error: err => {
      }
    });
  }

  highestItemId=0
  private createFolder(): void{
    this.highestItemId=0
    let dirTreeJSON = getLatestJSON();
    this.findHighestItemId(dirTreeJSON.dirTree);
    let currTreeNode = this.getCurrNode(dirTreeJSON);
    let newFolder = {"itemName": "newFolder", "itemId": String(this.highestItemId+1), "folder": "True", "folderContents":[]};
    currTreeNode.push(newFolder);
    loadTreeNode();
  }

  private deleteUserGroup(e: any){
    const userGroupId = Number(e.target.getAttribute("data-usergroupId"));
    this.http.delete(
      apiServerUrl + '/usergroups/delete/' + userGroupId,
      httpOptions
    ).subscribe({
      next: (response) => {
        this.setLoadUserGroups(true);
        clearUserGroupView();
    },
      error: (err) => {
        alert(err);
      }
  })
  }

  private findHighestItemId(dirTreeJSON: any[]): void{
    dirTreeJSON.every((x) => this.checkFolder(x), this);
  }

  private checkFolder(b: any){
    if (Number(b.itemId)>this.highestItemId){
      this.highestItemId = Number(b.itemId);
    }
    if (b.folder === "True"){
      this.findHighestItemId(b.folderContents)
    }
    return true;
  }


  private openCreateAndAddMemoriesModal(e: any): void {
    const modalRef = this.modalService.open(CreateAndAddMemoryToUsergroupModalComponent);
    modalRef.componentInstance.usergroupId = Number(e.target.getAttribute("data-usergroupId"));
  }

  private openModifyMemoriesForUserGroupModal(e: any): void {
    const modalRef = this.modalService.open(ModifyMemoriesInUsergroupComponent, {modalDialogClass:"widerModals"});
    modalRef.componentInstance.usergroupId = Number(e.target.getAttribute("data-usergroupId"));
  }

  private openInviteUserToUserGroupModal(e: any): void{
    const modalRef = this.modalService.open(InviteUserToUserGroupModalComponent);
    modalRef.componentInstance.usergroupId = Number(e.target.getAttribute("data-usergroupId"));
  }

  private renameUserGroup(usergroupId: number, newName: string){
    return this.http.put(
      apiServerUrl + '/usergroups/rename/' + usergroupId,
      {"newName": newName},
      httpOptions
    )
  }

  private openRenameUserGroupModal(e: any): void{
      const dialogRef = this.dialog.open(RenameUserGroupDialog, {
        width: '250px',
        panelClass: 'rename-dialog',
        backdropClass: 'rename-dialog-backdrop',
      });

    const usergroupId = Number(e.target.getAttribute("data-usergroupId"));
    dialogRef.afterClosed().pipe(
      filter((newName) => newName!==null&&newName!==undefined),
      switchMap((newName) => {
        return this.renameUserGroup(usergroupId, newName);
      }),

      catchError(error => {
        return throwError(error);
      })
    )
      .subscribe({
        next: (result) => {
          this.setLoadUserGroups(true);
          this.setLoadUserGroupId(usergroupId);
        },
        error: (err) => {
          alert(err);
        }
      });
  }

  private openAddMemoriesModal(e: any): void {
    const modalRef = this.modalService.open(AddMemoryToUsergroupComponent, {modalDialogClass:"widerModals"});
    modalRef.componentInstance.usergroupId = Number(e.target.getAttribute("data-usergroupId"));
  }

  private getCurrNode(dirTreeJSON: any){
    let folderIdPath = getLatestFolderIdPath();
    let successfulSteps = 0;
    let treeNode = dirTreeJSON.dirTree;
    let start=0;
    let finish=folderIdPath.length;
    let i;

    for (i=start; i<finish; i++){
      let folderId = folderIdPath[i];
      treeNode.some(function (nodeItem: any, nodeItemInd: any) {
        if (nodeItem.folder==="True" && nodeItem.itemId==folderId){
          treeNode=treeNode[nodeItemInd].folderContents;
          successfulSteps++;
          return true;
        } else {
          return false;
        }
      });
    }
    if (successfulSteps!=folderIdPath.length){
      throw 'folder ID path mismatch error1';
    }
    return treeNode
  }
}
