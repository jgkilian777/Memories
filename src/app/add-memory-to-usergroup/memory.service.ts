import { Injectable } from '@angular/core';
import {catchError, map, mergeMap, Observable, throwError} from "rxjs";
import {MemoryItem} from "./memoryItem";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AddToUserGroupRequest} from "./addToUserGroupRequest";
import { clearLatestFolderIdPath } from 'src/main/resources/static/drag-and-drop';
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

  public openFileFromAngular(nodeItem: any, usergroupId: number){
    let fileId = nodeItem.fileId;
    const modalRef = this.modalService.open(ViewMemoryModalComponent);
    modalRef.componentInstance.usergroupId = usergroupId;
    modalRef.componentInstance.fileId = fileId;
  }

  public removeMemoryFromUserGroup(memoryId: number, usergroupId: number){
    let removeFromUserGroupRequest: AddToUserGroupRequest = {usergroupId: usergroupId, memoryId: memoryId, refreshDirTreeJSON: true};
    return this.http.post(apiServerUrl+'/memories/removefromusergroup', removeFromUserGroupRequest, httpOptions);
  }

  public addMemoryToUsergroup(usergroupId: number, memoryId: number){
    let addToUserGroupRequest: AddToUserGroupRequest = {usergroupId: usergroupId, memoryId: memoryId, refreshDirTreeJSON: true};
    let response = this.http.post(apiServerUrl+'/memories/addtousergroup', addToUserGroupRequest, httpOptions).pipe(
      map(x=>{clearLatestFolderIdPath(); return x})
    );
    return response;
  }

}
