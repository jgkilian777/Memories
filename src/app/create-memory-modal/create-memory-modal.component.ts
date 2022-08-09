import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEventType} from "@angular/common/http";
import {catchError, filter, mergeMap, Subscription, throwError} from "rxjs";
import {finalize} from "rxjs/operators";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "../auth/storage.service";
import {MemoryItem} from "../add-memory-to-usergroup/memoryItem";
import {MemoryService} from "../add-memory-to-usergroup/memory.service";


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

  isMemoryFailed = false;
  errorMessage = '';

  formSubmitted=false;

  requiredFileType = ".jpeg, .jpg, .png, .mp4, .webm, .gif";

  @Input() memories: MemoryItem[];

  @Output() memoriesChange = new EventEmitter<MemoryItem[]>();

  constructor(private http: HttpClient, public activeModal: NgbActiveModal,  private storageService: StorageService, private memoryService: MemoryService) {}

  ngOnInit(): void {
  }


  fileName = '';
  uploadProgress:number | null;
  uploadSub: Subscription | null;

  file:File | null;

  onFileSelected(event: any) {
    this.file = event.target.files[0];

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

        mergeMap(success => {
          return this.memoryService.getMemories();
        }),
        catchError(error => {
          return throwError(error);
        })

      ).subscribe({
        next: response => {
          this.isMemoryFailed = false;
          this.formSubmitted=true;
          this.memories=response;
          this.memoriesChange.emit(this.memories);
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isMemoryFailed = true;
        }
      })

    }

  }

}
