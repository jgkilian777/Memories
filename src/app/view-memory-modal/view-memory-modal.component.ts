import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {MemoryItem} from "../add-memory-to-usergroup/memoryItem";


@Component({
  selector: 'app-view-memory-modal',
  templateUrl: './view-memory-modal.component.html',
  styleUrls: ['./view-memory-modal.component.css']
})
export class ViewMemoryModalComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() private fileId: number;
  @Input() private usergroupId: number;

  loadMediaTypeFailed = false;
  errorMessage = '';
  alreadyInitialised = false;

  @ViewChild('mediaContainer') mediaContainer: ElementRef;

  constructor(public activeModal: NgbActiveModal, private el: ElementRef, private renderer:Renderer2, private changeDetectorRef: ChangeDetectorRef, private http: HttpClient) { }

  ngOnInit(): void {

  }

  ngAfterViewInit () {
    console.log("TESTING TESTING TESTING --------------------------");
    console.log(typeof this.fileId);
    console.log(typeof this.usergroupId);
    if (!(typeof this.fileId === 'undefined' || this.fileId === null || typeof this.usergroupId === 'undefined' || this.usergroupId === null || this.alreadyInitialised===true)){
      this.initMediaView();
      this.alreadyInitialised=true;
    }
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (!(typeof this.fileId === 'undefined' || this.fileId === null || typeof this.usergroupId === 'undefined' || this.usergroupId === null || this.alreadyInitialised===true)){

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

    const memoryMimeTypeResp = this.http.get('http://localhost:8080/api/memories/'+String(this.usergroupId)+'/'+String(this.fileId)+'/type').subscribe({
      next: (memoryMimeType: any) => {
        if (this.videoMimeTypes.has(memoryMimeType.memoryFileType)){
          this.initVideoView();
        } else if (this.imageMimeTypes.has(memoryMimeType.memoryFileType)){
          this.initImageView();
        }
      },
      error: (err) => {
        this.loadMediaTypeFailed = true;
        this.errorMessage = err;
        console.log(err);
      }
    });


  }

  initVideoView(){
    const vidEle = this.renderer.createElement('video');

    vidEle.src = 'http://localhost:8080/api/memories/'+String(this.usergroupId)+'/'+String(this.fileId);

    vidEle.autoplay = false;
    vidEle.controls = true;
    vidEle.muted = false;
    vidEle.height = 240;
    vidEle.width = 320;


    console.log(this.renderer);
    console.log(this.mediaContainer);

    this.renderer.appendChild(this.mediaContainer.nativeElement, vidEle);


    console.log("SHOULD BE DONE?");
  }

  initImageView(){
    const imgEle = this.renderer.createElement('img');

    imgEle.src = 'http://localhost:8080/api/memories/'+String(this.usergroupId)+'/'+String(this.fileId);

    console.log(this.mediaContainer);

    this.renderer.appendChild(this.mediaContainer.nativeElement, imgEle);


  }


}
