import { Injectable } from '@angular/core';
import {catchError, mergeMap, Observable, throwError} from "rxjs";
import {UserGroup} from "../usergroups/userGroup";
import {MemoryItem} from "./memoryItem";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UsergroupsService} from "../usergroups/usergroups.service";
import {AddToUserGroupRequest} from "./addToUserGroupRequest";
import {UserGroupService} from "../usergroup/user-group.service";
import { clearLatestFolderIdPath } from 'src/main/resources/static/drag-and-drop';
import {
  CreateAndAddMemoryToUsergroupModalComponent
} from "../create-and-add-memory-to-usergroup-modal/create-and-add-memory-to-usergroup-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ViewMemoryModalComponent} from "../view-memory-modal/view-memory-modal.component";

const apiServerUrl = 'http://localhost:8080/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
};

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  constructor(private http: HttpClient,  private modalService: NgbModal) { }

  public getMemories(): Observable<MemoryItem[]> {
    return this.http.get<MemoryItem[]>(apiServerUrl+'/memories/all');

  }

  public getUserMemoriesInUserGroup(usergroupId: number): Observable<MemoryItem[]> {
    return this.http.get<MemoryItem[]>(apiServerUrl+'/memories/curruser/usergroup/'+usergroupId);
  }

  public renameMemory(memoryId: number, newName: string){
    const body = {"memoryId": memoryId, "newName": newName};
    return this.http.put(apiServerUrl+'/memories/renamememory', body, httpOptions);
  }

  public deleteUserMemory(memoryId: number){
    return this.http.delete(apiServerUrl+'/memories/deletememory/'+memoryId);
  }

  public openFileFromAngular(_this: any, e: any, nodeItem: any, usergroupId: number){
    // console.log(_this);
    // console.log(e);
    // console.log(nodeItem);
    // console.log(this);
    let fileId = nodeItem.fileId;
    // usergroupId
    const modalRef = this.modalService.open(ViewMemoryModalComponent);
    modalRef.componentInstance.usergroupId = usergroupId;
    modalRef.componentInstance.fileId = fileId;
  }

  public removeMemoryFromUserGroup(memoryId: number, usergroupId: number){

    let addToUserGroupRequest: AddToUserGroupRequest = {usergroupId: usergroupId, memoryId: memoryId, refreshDirTreeJSON: true};

    return this.http.post(apiServerUrl+'/memories/removefromusergroup', addToUserGroupRequest, httpOptions);
  }


  public addMemoryToUsergroup(usergroupId: number, memoryId: number, _this: any, currUserName: string){

    // const formData = new FormData();
    // formData.append("ddd3", "ddd3");
    // formData.append("ddd4", "ddd4");
    let addToUserGroupRequest: AddToUserGroupRequest = {usergroupId: usergroupId, memoryId: memoryId, refreshDirTreeJSON: true};

    let response = this.http.post(apiServerUrl+'/memories/addtousergroup', addToUserGroupRequest, httpOptions);

    // let response = this.http.post(apiServerUrl+"/memories/addtousergroup",
      // formData,

      // {
      //   "usergroupId": String(usergroupId),
      //   "memoryId": String(memoryId),
      // },

      // addToUserGroupRequest,

      // httpOptions);
    // console.log(response);
    // console.log(response);
    // console.log(response);
    // console.log(response);
    // console.log(response);
    // console.log(response);
    // console.log(response.subscribe());


    response.pipe(
      // mergeMap(success => {
        // return this.usergroupService.saveJSONObservable(usergroupId);
        // return this.usergroupService.addMemoryToJSON(usergroupId);
      // }),
      mergeMap(success => {

        console.log("CLEARED LATEST FOLDERID PATH2")
        clearLatestFolderIdPath();
        return _this.usergroupService.loadUserGroupFull(usergroupId, currUserName);
      }),
      catchError(error => {
        console.log(error);
        _this.isAddedToUserGroupFailed = true;
        _this.errorMessage2 = error;
        return throwError(error);
      })

    ).subscribe(
      {
        next: response => {
          _this.isAddedToUserGroupSuccessful = true;
          _this.isAddedToUserGroupFailed = false;
          return response;
        }, error: err => {
          console.log(err);
          _this.isAddedToUserGroupFailed = true;
          _this.errorMessage2 = _this.errorMessage2 + ' ... ' + err;
        }
      }
    )

  }

}
