import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../auth/storage.service";

const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
};

@Injectable({
  providedIn: 'root'
})
export class CreateUserGroupService {
  constructor(private http: HttpClient) {}


}
