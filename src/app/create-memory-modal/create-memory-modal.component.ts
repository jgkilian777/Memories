import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {Subscription} from "rxjs";
import {finalize} from "rxjs/operators";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "../auth/storage.service";
import {UserGroupService} from "../usergroup/user-group.service";
import {CreateMemoryService} from "./create-memory.service";

const apiServerUrl = 'http://localhost:8080/api';

@Component({
  selector: 'app-create-memory-modal',
  templateUrl: './create-memory-modal.component.html',
  styleUrls: ['./create-memory-modal.component.css']
})
export class CreateMemoryModalComponent implements OnInit {
  form: any = {
    memoryname: null,
  };
  isSuccessful = false;
  isMemoryFailed = false;
  errorMessage = '';

  constructor(private http: HttpClient, public activeModal: NgbActiveModal,  private storageService: StorageService, private memoryService: CreateMemoryService) {}

  ngOnInit(): void {
  }


  // @Input()
  requiredFileType:string;

  fileName = '';
  uploadProgress:number | null;
  uploadSub: Subscription | null;

  file:File | null;

  onFileSelected(event: any) {
    this.file = event.target.files[0];

    // if (this.file!=null) {
    //   this.fileName = this.file.name;
    //   const formData = new FormData();
    //   formData.append("thumbnail", this.file);
    //
    //   const upload$ = this.http.post("/api/thumbnail-upload", formData, {
    //     reportProgress: true,
    //     observe: 'events'
    //   })
    //     .pipe(
    //       finalize(() => this.reset())
    //     );
    //
    //   this.uploadSub = upload$.subscribe(event => {
    //     if (event.type == HttpEventType.UploadProgress) {
    //       this.uploadProgress = Math.round(100 * (event.loaded / event.total));
    //     }
    //   })
    // }
  }

  cancelUpload() {
    if (this.uploadSub !== null) {
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


      this.uploadSub = upload$.subscribe({
        next: data => {

          if (data.type == HttpEventType.UploadProgress && data.total) {
            this.uploadProgress = Math.round(100 * (data.loaded / data.total));
          } else if (data.type == HttpEventType.Response) {
            console.log(data);
            this.isSuccessful = true;
            this.isMemoryFailed = false;
          }


        },
        error: err => {
          console.log(err);
          this.errorMessage = err.error.message;
          this.isMemoryFailed = true;
        }
      });
    }








  }

















}
