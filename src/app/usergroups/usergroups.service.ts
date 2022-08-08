import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {UserGroup} from "../usergroups/userGroup";
import {UserGroupFull} from "../usergroups/userGroupFull";
// import {initUserGroupView, toggleFolderDeposit, getLatestJSON} from "../../main/resources/static/drag-and-drop";
import {UserGroupService} from "../usergroup/user-group.service";
import {LoadUserGroupResponse} from "../usergroup/loadUserGroupResponse";
import {clearLatestFolderIdPath} from "../../main/resources/static/drag-and-drop";
import {UserInGroupView} from "../usergroup/userInGroupView";
import {PendingUserInGroupView} from "../usergroup/pendingUserInGroupView";
const apiServerUrl = 'http://localhost:8080/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
};

@Injectable({
  providedIn: 'root'
})
export class UsergroupsService {

  // isSuccessful = false;
  // isSaveJSONFailed = false;
  // errorMessage = '';

  constructor(private http: HttpClient, private usergroupService: UserGroupService) { }

  public getUserGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(apiServerUrl+'/usergroups');

  }

  public getPendingUserGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(apiServerUrl+'/usergroups/pending');

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


  // public loadUserGroup(usergroupId: number): Observable<any> {
  //   this.usergroupService.unHookButtons();
  //   console.log("HERE 111 111 111 111")
  //   clearLatestFolderIdPath();
  //   return this.usergroupService.loadUserGroup(usergroupId).pipe(
  //     map(response => {
  //       console.log("HERE 555 5555555");
  //       this.usergroupService.hookButtons(usergroupId);
  //       return response;
  //     })
  //   )
  // }

  // public unHookButtons(): void {
  //   let saveJSONbutton = document.getElementById('saveJSONbutton');
  //   let toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');
  //   let createFolderButton = document.getElementById('createFolderButton');
  //   let addMemoriesButton = document.getElementById('addMemoriesButton');
  //   if (saveJSONbutton !== null && toggleFolderDepositButton !== null && createFolderButton !== null && addMemoriesButton !== null){
  //
  //     saveJSONbutton.removeEventListener('click', this.saveJSON);
  //     toggleFolderDepositButton.onclick = null;
  //     createFolderButton.onclick = null;
  //     addMemoriesButton.onclick = null;
  //   } else {
  //     throw 'a button is missing';
  //   }
  // }
  //
  // public hookButtons(usergroup: UserGroup): void{
  //
  //   let saveJSONbutton = document.getElementById('saveJSONbutton');
  //   let toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');
  //   let createFolderButton = document.getElementById('createFolderButton');
  //   let addMemoriesButton = document.getElementById('addMemoriesButton');
  //   if (saveJSONbutton !== null && toggleFolderDepositButton !== null && createFolderButton !== null && addMemoriesButton !== null){
  //     saveJSONbutton.setAttribute("data-usergroupId", String(usergroup.id));
  //     saveJSONbutton.addEventListener('click', this.saveJSON);
  //
  //     toggleFolderDepositButton.onclick = toggleFolderDeposit;
  //     createFolderButton.onclick = createFolder;
  //     addMemoriesButton.onclick = addMemories;
  //   } else {
  //     throw 'a button is missing';
  //   }
  //
  // }

  // private saveJSON(e: any): void{
  //   let usergroupId = e.getAttribute("data-usergroupId");
  //   let dirTreeJSON = getLatestJSON();
  //   let response: Observable<any> = this.http.post<UserGroup>(
  //     apiServerUrl + '/usergroups/savedirstructure/' + usergroupId,
  //     {
  //       dirTreeJSON,
  //     },
  //     httpOptions
  //   );
  //   response.subscribe({
  //     next: data => {
  //       console.log(data);
  //       this.isSuccessful = true;
  //       this.isSaveJSONFailed = false;
  //       this.loadUserGroup(data);
  //     },
  //     error: err => {
  //       console.log(err);
  //       this.errorMessage = err.error.message;
  //       this.isSaveJSONFailed = true;
  //     }
  //   });
  // }






}
