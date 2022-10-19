import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "../auth/storage.service";
import {catchError, filter, map, mergeMap, Subscription, throwError} from "rxjs";
import {finalize} from "rxjs/operators";
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
  isMemoryFailed = false;
  errorMessage = '';
  currentUsername: string;

  formSubmitted = false;

  constructor(private http: HttpClient, public activeModal: NgbActiveModal,  private storageService: StorageService, private usergroupService: UserGroupService) {}

  ngOnInit(): void {
    this.currentUsername = this.storageService.getUser().username;
  }

  @Input() public usergroupId: number;

  requiredFileType = ".jpeg, .jpg, .png, .mp4, .webm, .gif, .mkv";

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

        mergeMap(success => {
          clearLatestFolderIdPath();
          return this.usergroupService.loadUserGroupFull(this.usergroupId, this.currentUsername);
        }),
        catchError(error => {
          return throwError(error);
        })

      ).subscribe({
        next: response => {
          this.isMemoryFailed = false;
          this.formSubmitted=true;
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isMemoryFailed = true;
        }
      })


    }


  }



}
