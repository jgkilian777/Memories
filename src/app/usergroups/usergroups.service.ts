import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserGroup} from "./userGroup";
const apiServerUrl = 'http://localhost:8080/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
};

@Injectable({
  providedIn: 'root'
})
export class UsergroupsService {

  constructor(private http: HttpClient) { }

  public getUserGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(apiServerUrl+'/usergroups');
  }

  public getPendingUserGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(apiServerUrl+'/usergroups/pending');
  }

}
