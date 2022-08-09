import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-view-user-memory-modal',
  templateUrl: './view-user-memory-modal.component.html',
  styleUrls: ['./view-user-memory-modal.component.css']
})
export class ViewUserMemoryModalComponent implements OnInit {


  @Input() private fileId: number;

  loadMediaTypeFailed = false;
  errorMessage = '';
  alreadyInitialised = false;

  @ViewChild('mediaContainer') mediaContainer: ElementRef;

  constructor(public activeModal: NgbActiveModal, private renderer:Renderer2, private http: HttpClient) { }

  ngOnInit(): void {
  }

  ngAfterViewInit () {
    if (!(typeof this.fileId === 'undefined' || this.fileId === null || this.alreadyInitialised===true)){
      this.initMediaView();
      this.alreadyInitialised=true;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (!(typeof this.fileId === 'undefined' || this.fileId === null || this.alreadyInitialised===true)){
      this.initMediaView();
      this.alreadyInitialised=true;
    }
  }


  videoMimeTypes = new Set([
    "video/mp4",
    "video/webm",

  ])

  imageMimeTypes = new Set([
    "image/gif",
    "image/jpeg",
    "image/png",
  ])


  initMediaView(){

    const memoryMimeTypeResp = this.http.get('http://localhost:8080/api/memories/'+String(this.fileId)+'/type').subscribe({
      next: (memoryMimeType: any) => {
        if (this.videoMimeTypes.has(memoryMimeType.memoryFileType)){
          this.initVideoView();
        } else if (this.imageMimeTypes.has(memoryMimeType.memoryFileType)){
          this.initImageView();
        }
      },
      error: (err) => {
        this.loadMediaTypeFailed = true;
        this.errorMessage = err.message;
      }
    });
  }

  initVideoView(){
    const vidEle = this.renderer.createElement('video');

    vidEle.src = 'http://localhost:8080/api/memories/userfile/'+String(this.fileId);

    vidEle.autoplay = false;
    vidEle.controls = true;
    vidEle.muted = false;
    vidEle.height = 240;
    vidEle.width = 320;

    this.renderer.appendChild(this.mediaContainer.nativeElement, vidEle);
  }

  initImageView(){
    const imgEle = this.renderer.createElement('img');

    imgEle.src = 'http://localhost:8080/api/memories/userfile/'+String(this.fileId);
    this.renderer.appendChild(this.mediaContainer.nativeElement, imgEle);
  }

}
