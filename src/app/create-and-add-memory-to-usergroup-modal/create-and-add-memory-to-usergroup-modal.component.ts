import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "../auth/storage.service";
import {CreateMemoryService} from "../create-memory-modal/create-memory.service";
import {catchError, filter, map, mergeMap, Subscription, throwError} from "rxjs";
import {finalize} from "rxjs/operators";
import {UserGroup} from "../usergroups/userGroup";
import {UsergroupsService} from "../usergroups/usergroups.service";
import {MemoryService} from "../add-memory-to-usergroup/memory.service";
import {AddToUserGroupRequest} from "../add-memory-to-usergroup/addToUserGroupRequest";
import {UserGroupService} from "../usergroup/user-group.service";
import { clearLatestFolderIdPath } from 'src/main/resources/static/drag-and-drop';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
};
const apiServerUrl = 'http://localhost:8080/api';

@Component({
  selector: 'app-create-and-add-memory-to-usergroup-modal',
  templateUrl: './create-and-add-memory-to-usergroup-modal.component.html',
  styleUrls: ['./create-and-add-memory-to-usergroup-modal.component.css']
})

export class CreateAndAddMemoryToUsergroupModalComponent implements OnInit {

  form: any = {
    memoryname: null,
  };
  isSuccessful = false;
  isMemoryFailed = false;
  errorMessage = '';
  errorMessage2 = '';
  isAddedToUserGroupSuccessful = false;
  isAddedToUserGroupFailed = false;
  currentUsername: string;


  constructor(private http: HttpClient, public activeModal: NgbActiveModal,  private storageService: StorageService, private memoryService: MemoryService, private usergroupService: UserGroupService) {}

  ngOnInit(): void {
    this.currentUsername = this.storageService.getUser().username;
  }

  @Input() public usergroupId: number;
  // @Input() public usergroup: UserGroup;

  // @Input()
  requiredFileType:string;

  fileName = '';
  uploadProgress:number | null;
  uploadSub: Subscription | null;

  file:File | null;

  onFileSelected(event: any) {
    this.file = event.target.files[0];


  }

  cancelUpload() {
    if (this.uploadSub!==null){
      this.uploadSub.unsubscribe();
    }
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }




  onSubmit(): void {
    const { memoryname } = this.form;
    // const adminUsername = this.storageService.getUser().username;


    // let addToUserGroupRequest: AddToUserGroupRequest = {usergroupId: usergroupId, memoryId: memoryId}
    //
    // let response = this.http.post(apiServerUrl+'/memories/addtousergroup', addToUserGroupRequest, httpOptions);
    //
    //
    // response.pipe(
    //   mergeMap(success => {
    //     return this.usergroupService.saveJSONObservable(usergroupId);
    //   }),
    //   mergeMap(success => {
    //     return _this.usergroupsService.loadUserGroup(usergroupId);
    //   }),
    //   catchError(error => {
    //     console.log(error);
    //     _this.isAddedToUserGroupFailed = true;
    //     _this.errorMessage2 = error;
    //     return throwError(error);
    //   })
    //
    // ).subscribe(
    //   {
    //     next: response => {
    //       _this.isAddedToUserGroupSuccessful = true;
    //       _this.isAddedToUserGroupFailed = false;
    //       return response;
    //     }, error: err => {
    //       console.log(err);
    //       _this.isAddedToUserGroupFailed = true;
    //       _this.errorMessage2 = _this.errorMessage2 + ' ... ' + err;
    //     }
    //   }
    // )

    if (this.file!=null) {
      this.fileName = this.file.name;
      const formData = new FormData();
      formData.append("userFile", this.file);
      formData.append("memoryName", memoryname);

      const upload$ = this.http.post(apiServerUrl+"/memories/creatememory", formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          finalize(() => this.reset())
        );




      this.uploadSub = upload$.pipe(

        filter(response => {
          if (response.type == HttpEventType.UploadProgress && response.total!==undefined){
            this.uploadProgress = Math.round(100 * (response.loaded / response.total));
            return false;
          } else if (response.type == HttpEventType.Response && response.body!==null) {
            console.log(response);
            console.log(response.body);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!^^^^^^^^^^^^^^");
            console.log(this.usergroupId);
            let responseBodyTmp: any = response.body;
            console.log(responseBodyTmp['memoryId']);
            console.log(responseBodyTmp.memoryId);

            // this.isSuccessful = true;
            // this.isMemoryFailed = false;
            return true;
          } else {
            return false;
          }
        }),

        mergeMap(response => {
          if (response.type != HttpEventType.Response){
            throw throwError(() => new Error('HttpEventType somehow wrong'));
          }
          let tmpBody: any = response.body;
          let addToUserGroupRequest: AddToUserGroupRequest = {usergroupId: this.usergroupId, memoryId: tmpBody.memoryId, refreshDirTreeJSON: true};
          return this.http.post(apiServerUrl+'/memories/addtousergroup', addToUserGroupRequest, httpOptions);
          }),
        // mergeMap(success => {
        //   return this.usergroupService.saveJSONObservable(this.usergroupId);
        // }),
        mergeMap(success => {
          console.log("CLEARED LATEST FOLDERID PATH3")
          clearLatestFolderIdPath();
          return this.usergroupService.loadUserGroupFull(this.usergroupId, this.currentUsername);
        }),
        catchError(error => {
          console.log(error);
          this.isAddedToUserGroupFailed = true;
          this.errorMessage2 = error;
          return throwError(error);
        })

      ).subscribe({
        next: response => {
          this.isSuccessful = true;
          this.isMemoryFailed = false;
        },
        error: err => {
          console.log(err);
          this.errorMessage = err.error.message;
          this.isMemoryFailed = true;
        }
      })












      // this.uploadSub = upload$.subscribe({
      //   next: data => {
      //
      //     if (data.type == HttpEventType.UploadProgress && data.total!==undefined) {
      //       this.uploadProgress = Math.round(100 * (data.loaded / data.total));
      //     } else if (data.type == HttpEventType.Response) {
      //       console.log(data);
      //       console.log(data.body);
      //       console.log("@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!^^^^^^^^^^^^^^");
      //
      //       this.isSuccessful = true;
      //       this.isMemoryFailed = false;
      //
      //       if (data.body!==null){
      //         let responseBody: any = data.body;
      //         console.log(this.usergroupId);
      //         console.log(responseBody['memoryId']);
      //         console.log(responseBody.memoryId);
      //         this.memoryService.addMemoryToUsergroup(this.usergroupId, responseBody.memoryId, this);
      //       }
      //
      //     }
      //
      //   },
      //   error: err => {
      //     console.log(err);
      //     this.errorMessage = err.error.message;
      //     this.isMemoryFailed = true;
      //   }
      // });
    }








  }










}
