import {Injectable} from '@angular/core';
import {catchError, filter, map, mergeMap, Observable, Observer, Subject, switchMap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
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
// import * as $ from 'jquery';
// declare let jQuery: any;

// import {$, jquery} from "jquery";
// import 'bootstrap';
// declare var $:any;
// import $ from 'jquery';

import {
  CreateAndAddMemoryToUsergroupModalComponent
} from "../create-and-add-memory-to-usergroup-modal/create-and-add-memory-to-usergroup-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddMemoryToUsergroupComponent} from "../add-memory-to-usergroup/add-memory-to-usergroup.component";
import {LoadUserGroupResponse} from "./loadUserGroupResponse";
import {UserInGroupView} from "./userInGroupView";
import {PendingUserInGroupView} from "./pendingUserInGroupView";
import {InviteUserToUserGroupRequest} from "./inviteUserToUserGroupRequest";
import {
  InviteUserToUserGroupModalComponent
} from "../invite-user-to-user-group-modal/invite-user-to-user-group-modal.component";
import {StorageService} from "../auth/storage.service";
import {MemoryService} from "../add-memory-to-usergroup/memory.service";
import {
  ModifyMemoriesInUsergroupComponent, RenameMemoryDialog
} from "../modify-memories-in-usergroup/modify-memories-in-usergroup.component";
import {MemoryItem} from "../add-memory-to-usergroup/memoryItem";
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

  private loadUserGroupResponseSubject: Subject<LoadUserGroupResponse> = new Subject<LoadUserGroupResponse>();

  setLoadUserGroupResponse(loadUserGroupResponse: LoadUserGroupResponse){
    this.loadUserGroupResponseSubject.next(loadUserGroupResponse);
  }
  getLoadUserGroupResponse(): Observable<LoadUserGroupResponse>{
    return this.loadUserGroupResponseSubject;
  }


  private loadUserGroupIdSubject:  Subject<number> = new Subject<number>();

  setLoadUserGroupId(userGroupId: number){
    this.loadUserGroupIdSubject.next(userGroupId);
  }
  getLoadUserGroupId(): Observable<number>{
    return this.loadUserGroupIdSubject;
  }

  private loadUserGroupUsersSubject:  Subject<boolean> = new Subject<boolean>();

  setLoadUserGroupUsers(junk: boolean){
    this.loadUserGroupUsersSubject.next(junk);
  }
  getLoadUserGroupUsers(): Observable<boolean>{
    return this.loadUserGroupUsersSubject;
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


  // public loadUserGroupResponseObservable = new Observable<LoadUserGroupResponse>();
  // private loadUserGroupResponse: LoadUserGroupResponse;

  // setLoadUserGroupResponse(loadUserGroupSuccess: boolean, err: String){
  //   this.loadUserGroupResponseObservable.next({"loadUserGroupSuccess": loadUserGroupSuccess, "err": err});
  // }

  // loadUserGroupResponseSubscriber(observer: Observer<LoadUserGroupResponse>){
  //   observer.next(this.loadUserGroupResponse);
  //   observer.complete();
  //   return {unsubscribe() {}};
  // }



  isSuccessful = false;
  isSaveJSONFailed = false;
  errorMessage = '';
  submittedSomething = false;
  // userGroupLoadFailed=false;
  // dirTreeJSON: JSON;

  constructor(private http: HttpClient, private modalService: NgbModal, private storageService: StorageService, private memoryService: MemoryService, public dialog: MatDialog) { }

  // public getUserGroups(): Observable<UserGroup[]> {
  //   return this.http.get<UserGroup[]>(apiServerUrl+'/usergroups');
  //
  // }

  // public getUserGroup(userGroupId: number): Observable<UserGroup> {
  //   return this.http.get<UserGroup>(apiServerUrl+'/usergroups/${userGroupId}');
  //
  // }


  // public loadUserGroupFull(usergroupId: number): Observable<any> {
  //   this.usergroupService.unHookButtons();
  //   console.log("HERE 111 111 111 111")
  //   clearLatestFolderIdPath();
  //   return this.usergroupService.loadUserGroup(usergroupId).pipe(
  //     map(response => {
  //       console.log("HERE 555 5555555");
  //       this.usergroupService.hookButtons(usergroupId);
  //       return response;
  //     })
  //   this.requiredUserGroup=2;
  //
  //   )
  //
  //
  //
  // }

  public loadUserGroupFull(usergroupId: number, currUserName: string): Observable<any> {
    this.unHookButtons();
    console.log("HERE 111 111 111 111")
    clearLatestFolderIdPath();
    return this.loadUserGroup(usergroupId, currUserName).pipe(
      map(response => {
        console.log("HERE 555 5555555");
        this.hookButtons(usergroupId);
        return response;
      })
    )
  }

  public loadUserGroup(usergroupId: number, currUserName: string): Observable<any> {

    return this.http.get<UserGroupFull>(apiServerUrl+'/usergroups/'+usergroupId).pipe(

    map(response => {
      console.log("HERE 44444");
      console.log(response)
      let userCanDrag: boolean;
      if (currUserName===response.adminUsername){
        userCanDrag=true;
      } else {
        userCanDrag=false;
      }
      initUserGroupView(JSON.parse(response.directoryTreeJSON), response.name, userCanDrag, this.memoryService.openFileFromAngular.bind(this.memoryService), usergroupId);
          console.log(response.directoryTreeJSON);
          console.log("HERE 222 222 222 222");
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
    let inviteUserToUserGroupRequest: InviteUserToUserGroupRequest = {username:username, usergroupId:usergroupId}
    return this.http.post(
      apiServerUrl + '/usergroups/removeinviteuser',

        inviteUserToUserGroupRequest,

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
    let inviteUserToUserGroupRequest: InviteUserToUserGroupRequest = {username:username, usergroupId:usergroupId}
    console.log(inviteUserToUserGroupRequest);
    console.log(username);
    console.log(usergroupId);
    return this.http.post(
      apiServerUrl + '/usergroups/removeuser',

        inviteUserToUserGroupRequest,

      httpOptions
    );
  }


  public unHookButtons(): void {
    console.log("UNHOOKED BUTTONS UNHOOKED BUTTONS UNHOOKED BUTTONS UNHOOKED BUTTONS UNHOOKED BUTTONS ")
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
      // saveJSONbutton.onclick = null;
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


      // toggleFolderDepositButton.onclick = null;
      // createFolderButton.onclick = null;
      // addMemoriesButton.onclick = null;
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
    console.log("HOOK BUTTONS HOOK BUTTONS HOOK BUTTONS HOOK BUTTONS HOOK BUTTONS HOOK BUTTONS HOOK BUTTONS ")
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
    // let jQuery: any;

    // console.log($('.subgrid_dnd'));

    // $('.subgrid_dnd').fitText();
    //
    // console.log(jQuery('.box_dnd'));
    //
    // console.log(jQuery(".fullcontainer_dnd"));
    //
    // console.log(jQuery("#addMemoriesButton"));






  }








  public saveJSONObservable(usergroupId: number): Observable<any>{
    let dirTreeJSON = getLatestJSON();
    console.log(dirTreeJSON);
    let saveJSONObservable: Observable<any> = this.http.post<UserGroup>(
      apiServerUrl + '/usergroups/savedirstructure/' + usergroupId,
      {
        dirTreeJSON,
      },
      httpOptions
    ).pipe(
        map(response => {
          console.log(response);
          this.isSuccessful = true;
          this.isSaveJSONFailed = false;
          this.submittedSomething = true;

          return response;
          }
        ),
        mergeMap(response => {
          clearLatestFolderIdPath();
          return this.loadUserGroup(usergroupId, this.storageService.getUser().username);
        })


      );
      return saveJSONObservable;
    // response.subscribe({
    //   next: data => {
    //     console.log(data);
    //     this.isSuccessful = true;
    //     this.isSaveJSONFailed = false;
    //     this.submittedSomething = true;
    //     this.loadUserGroup(usergroupId);
    //   },
    //   error: err => {
    //     console.log(err);
    //     this.errorMessage = err.error.message;
    //     this.submittedSomething = true;
    //     this.isSaveJSONFailed = true;
    //   }
    // });
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
    console.log(dirTreeJSON);
    let response: Observable<any> = this.http.post<UserGroup>(
      apiServerUrl + '/usergroups/savedirstructure/' + usergroupId,
      {
        dirTreeJSON,
      },
      httpOptions
      ).pipe(
        mergeMap( response2 => {
          console.log(response2);
          this.isSuccessful = true;
          this.isSaveJSONFailed = false;
          this.submittedSomething = true;
          clearLatestFolderIdPath();
          console.log("CLEARED LATEST FOLDERID PATH1")
          return this.loadUserGroup(usergroupId, this.storageService.getUser().username);
          }
        ),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
      )
    response.subscribe({
      next: data => {
        console.log(data);
        // this.isSuccessful = true;
        // this.isSaveJSONFailed = false;
        // this.submittedSomething = true;
        // this.loadUserGroup(usergroupId);
      },
      error: err => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.submittedSomething = true;
        this.isSaveJSONFailed = true;
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
    ).pipe(

    ).subscribe({
      next: (response) => {
        this.setLoadUserGroups(true);
        clearUserGroupView();
    },
      error: (err) => {
        console.log(err);
        alert(err);
      }
  })
  }

  private findHighestItemId(dirTreeJSON: any[]): void{
    // dirTreeJSON.forEach(this.checkFolder);
    // var highestItemId = 0;
    dirTreeJSON.every((x) => this.checkFolder(x), this);

  }

  private checkFolder(b: any){
    if (Number(b.itemId)>this.highestItemId){
      console.log("THIS SHOULD NEVER BE UNDEFINED:");
      console.log(Number(b.itemId));
      this.highestItemId = Number(b.itemId);
    }
    if (b.folder === "True"){

      this.findHighestItemId(b.folderContents)
    } else if (b.folder === "False"){
      if (Number(b.itemId)>this.highestItemId){
        // console.log("THIS SHOULD NEVER BE UNDEFINED:");
        // console.log(Number(b.itemId));
        // this.highestItemId = Number(b.itemId);
      }
    }
    return true;
  }


  private openCreateAndAddMemoriesModal(e: any): void {
    const modalRef = this.modalService.open(CreateAndAddMemoryToUsergroupModalComponent);
    modalRef.componentInstance.usergroupId = Number(e.target.getAttribute("data-usergroupId"));
  }

  private openModifyMemoriesForUserGroupModal(e: any): void {
    const modalRef = this.modalService.open(ModifyMemoriesInUsergroupComponent);
    modalRef.componentInstance.usergroupId = Number(e.target.getAttribute("data-usergroupId"));
  }

  private openInviteUserToUserGroupModal(e: any): void{
    const modalRef = this.modalService.open(InviteUserToUserGroupModalComponent);
    modalRef.componentInstance.usergroupId = Number(e.target.getAttribute("data-usergroupId"));
  }

  private renameUserGroup(usergroupId: number, newName: string){
    // const formData = new FormData();
    // formData.append("newName", newName);
    return this.http.put(
      apiServerUrl + '/usergroups/rename/' + usergroupId,

      {"newName": newName},

      httpOptions
    )
  }

  private openRenameUserGroupModal(e: any): void{
    // openRenameMemoryModal(memoryId: number){
    //   this.renameModalMemoryId = memoryId;

      const dialogRef = this.dialog.open(RenameUserGroupDialog, {
        width: '250px',
        // data: {name: this.name, animal: this.animal},
        panelClass: 'rename-dialog',
        backdropClass: 'rename-dialog-backdrop',
        // autoFocus: true,
      });

    const usergroupId = Number(e.target.getAttribute("data-usergroupId"));

      dialogRef.afterClosed().pipe(
        filter((newName) => newName!==null&&newName!==undefined),
        switchMap((newName) => {

          return this.renameUserGroup(usergroupId, newName);
        }),

        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      )
        .subscribe({
          next: (result) => {
            console.log(result);
            // this.memories = result;
            // this.modifyMemoryFailed=false;
            this.setLoadUserGroups(true);
            this.setLoadUserGroupId(usergroupId);
          },
          error: (err) => {
            console.log(err);
            alert(err);
            // this.modifyMemoryFailed=true;
            // this.errorMessage=err;
          }
        });




  }

  private openAddMemoriesModal(e: any): void {
    // console.log(e)
    // console.log(typeof e)
    const modalRef = this.modalService.open(AddMemoryToUsergroupComponent);
    // console.log(e)
    // console.log(typeof e)
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
