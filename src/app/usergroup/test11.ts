import * as $ from "jquery";
// import {$, jquery} from "jquery";
// import 'bootstrap';
// import {$, jquery} from "jquery";
// var $;
import {Injectable} from '@angular/core';
import {map, Observable, Observer, Subject} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {UserGroup} from "../usergroups/userGroup";
import {UserGroupFull} from "../usergroups/userGroupFull";
// import {
//   getLatestFolderIdPath,
//   getLatestJSON,
//   initUserGroupView,
//   loadTreeNode,
//   toggleFolderDeposit
// } from "../../main/resources/static/drag-and-drop";



// import {$, jquery} from "jquery";
// import 'bootstrap';
// declare var $:any;

import {
  CreateAndAddMemoryToUsergroupModalComponent
} from "../create-and-add-memory-to-usergroup-modal/create-and-add-memory-to-usergroup-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddMemoryToUsergroupComponent} from "../add-memory-to-usergroup/add-memory-to-usergroup.component";
import {LoadUserGroupResponse} from "./loadUserGroupResponse";

const apiServerUrl = 'http://localhost:8080/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
};

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  private loadUserGroupResponseSubject: Subject<LoadUserGroupResponse> = new Subject<LoadUserGroupResponse>();

  setLoadUserGroupResponse(loadUserGroupResponse: LoadUserGroupResponse) {
    this.loadUserGroupResponseSubject.next(loadUserGroupResponse);
  }

  getLoadUserGroupResponse(): Observable<LoadUserGroupResponse> {
    return this.loadUserGroupResponseSubject;
  }


  // public loadUserGroupResponseObservable = new Observable<LoadUserGroupResponse>();
  // private loadUserGroupResponse: LoadUserGroupResponse;

  // setLoadUserGroupResponse(loadUserGroupSuccess: boolean, err: String){
  //   this.loadUserGroupResponseObservable.next({"loadUserGroupSuccess": loadUserGroupSuccess, "err": err});
  // }

  // loadUserGroupResponseSubscriber(observer: Observer<LoadUserGroupResponse>){
  //   observer.next(this.loadUserGroupResponse);
  //   observer.complete();
  //   return {unsubscribe() {}};
  // }


  isSuccessful = false;
  isSaveJSONFailed = false;
  errorMessage = '';
  submittedSomething = false;
  // userGroupLoadFailed=false;
  // dirTreeJSON: JSON;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }



  initDragStartZindex() {
    //    console.log("DOING THING111111");
    if (this.dragging) {

      let allBehindItems = document.querySelectorAll('.containerbehind .behindbox');

      this.behindItems.forEach((behindItem: any)=> {
        if (!behindItem.classList.contains("folderbehind")) {
          behindItem.style.zIndex = 3;

        } else if (this.folderbehindzindex === 3) {

          //                console.log(behindItem.style.zIndex);
          behindItem.style.zIndex = 3;
          //                console.log(behindItem.style.zIndex);
        }

      });
    }
  }


  dragging = false;

  dragSrcEl = null;



  handleDragStart(e: any) {
    e.target.style.opacity = '0.4';
    //    console.log("starting drag");

    this.dragSrcEl = e.target;

    e.dataTransfer.effectAllowed = 'move';
    this.dragging = true
    setTimeout(this.initDragStartZindex, 10);


  }



  handleDragOver(e: any) {
    console.log(222);
    //    console.log(this);
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }



  handleDragOverBehind(e: any) {
    //        console.log(this);
    console.log(333);
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }




  handleDragEnter(e: any) {
    //    console.log(444);
    e.target.classList.add('over');
  }



  handleDragLeave(e: any) {
    //  console.log(555);
    e.target.classList.remove('over');
  }



  handleDrop(e: any) { // this is only for folders since when dropping stuff onto files itll use the behind grid

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    //    console.log("ok?????????????")
    if (this.dragSrcEl != e.target) {
      let treeNode = this.getNodeJSON(0);
      let itemInd;
      let folderInd;
      //        console.log(this)
      treeNode.some((nodeItem: any, nodeItemInd: any)=> {
        //            console.log(nodeItem.itemId)
        //            console.log("huhh3333333333??")
        //            console.log(this)
        if (nodeItem.itemId === e.target.id) {
          if (nodeItem.folder === "True") {
            folderInd = nodeItemInd;

          }
          return true;
        } else {return false;}
      })
      treeNode.some( (nodeItem: any, nodeItemInd: any)=> {
        // @ts-ignore
        if (nodeItem.itemId === this.dragSrcEl.id) {
          itemInd = nodeItemInd;
          return true;
        } else {return false;}
      }, this)
      //        console.log("ok?????????????")
      //        console.log(folderInd)
      if (!(folderInd === undefined)) {
        let folderContents = treeNode[folderInd].folderContents;
        // @ts-ignore
        let srcBehindBefore = document.getElementById(this.dragSrcEl.id + "_0");
        // @ts-ignore
        let srcBehindAfter = document.getElementById(this.dragSrcEl.id + "_1");
        //            console.log(folderContents)
        let moveItem = treeNode.splice(itemInd, 1)[0];
        folderContents.push(moveItem);
        // @ts-ignore
        this.dragSrcEl.remove();
        // @ts-ignore
        srcBehindBefore.remove();
        // @ts-ignore
        srcBehindAfter.remove();
        //            console.log("ok?????????????")
      }
    }

    return false;
  }




  handleDropBehind(e: any) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    let [destId, beforeAfter] = e.target.id.split("_");
    let srcIndex;
    let destIndex;

    let treeNode = this.getNodeJSON(0);
    treeNode.some( (nodeItem: any, nodeItemInd: any) =>{
      if (nodeItem.itemId === destId) {
        destIndex = nodeItemInd;
        return true;
      } else{return false;}
    })

    treeNode.some( (nodeItem: any, nodeItemInd: any) =>{
      // @ts-ignore
      if (nodeItem.itemId === this.dragSrcEl.id) {
        srcIndex = nodeItemInd;
        return true;
      } else{return false;}
    })

    if (srcIndex === undefined || destIndex === undefined) {
      throw 'someone is editing html elements error';
    }


    if (srcIndex != destIndex && (srcIndex + 1 != destIndex || beforeAfter === '1') && (srcIndex - 1 != destIndex || beforeAfter === '0')) {

      let srcItemJSON = treeNode[srcIndex];
      let destElement = document.getElementById(destId);
      if (beforeAfter === '0') {
        //        console.log(this);
        //        console.log(dragSrcEl);
        treeNode.splice(srcIndex, 1);
        if (srcIndex < destIndex) {
          treeNode.splice(destIndex - 1, 0, srcItemJSON);
        } else {
          treeNode.splice(destIndex, 0, srcItemJSON);
        }

        // @ts-ignore
        destElement.before(this.dragSrcEl);

        // @ts-ignore
        let srcBehindBefore = document.getElementById(this.dragSrcEl.id + "_0");
        // @ts-ignore
        let srcBehindAfter = document.getElementById(this.dragSrcEl.id + "_1");
        let destBehindBefore = e.target;
        //        let destBehindAfter = this.nextSibling;
        destBehindBefore.before(srcBehindBefore);
        destBehindBefore.before(srcBehindAfter);

      } else if (beforeAfter === '1') {
        treeNode.splice(srcIndex, 1);
        if (srcIndex < destIndex) {
          treeNode.splice(destIndex, 0, srcItemJSON);
        } else {
          treeNode.splice(destIndex + 1, 0, srcItemJSON);
        }
        // @ts-ignore

        destElement.after(this.dragSrcEl);

        // @ts-ignore
        let srcBehindBefore = document.getElementById(this.dragSrcEl.id + "_0");
        // @ts-ignore
        let srcBehindAfter = document.getElementById(this.dragSrcEl.id + "_1");
        let destBehindAfter = e.target;
        //        let destBehindBefore = this.previousSibling;
        destBehindAfter.after(srcBehindAfter);
        destBehindAfter.after(srcBehindBefore);


      }

    }

    return false;
  }




  handleDragEnd(e: any) {
    //    console.log(this);
    this.dragging = false
    e.target.style.opacity = '1';

    this.items.forEach( (item: any)=> {
      item.classList.remove('over');
    });

    let allBehindItems = document.querySelectorAll('.containerbehind .behindbox');
    this.behindItems.forEach( (behindItem: any) =>{
      behindItem.style.zIndex = 1;
      behindItem.classList.remove('over');
    });


  }



  openFolder(_this: any, e: any, nodeItem: any) {

    // @ts-ignore
    this.folderIdPath.push(nodeItem.itemId);
    this.loadTreeNode();

  }



  openFile(_this: any, e: any, nodeItem: any) {
    //    console.log("hmm1");
    //    console.log(this);
    _this.innerHTML = "file opened";
  }




  openItem(e: any) {
    let openItemId = e.target.id;
    //    console.log(this);
    var _this = e.target

    let treeNode = this.getNodeJSON(0);
    treeNode.some( (nodeItem: any, nodeItemInd: any) =>{
      //        console.log(this);
      if (nodeItem.itemId == openItemId) {
        if (nodeItem.folder === "True") {
          this.openFolder(_this, e, nodeItem);
        } else if (nodeItem.folder == "False") {
          //                console.log(this);
          this.openFile(_this, e, nodeItem);
        }
        return true;
      } else {
        return false;
      }
    });

  }



  prevNode() {
    //    pop then getNodeJSON()?
    this.folderIdPath.pop();
    this.loadTreeNode();
    return
  }



  getNodeJSON(relativeIndDiff: any) {
    var successfulSteps = 0;
    var treeNode = this.dirTreeJSON.dirTree;

    let start = 0;
    let finish = this.folderIdPath.length + relativeIndDiff;
    let i;

    for (i = start; i < finish; i++) {
      let folderId = (this.folderIdPath)[i];
      treeNode.some( (nodeItem: any, nodeItemInd: any) =>{
        if (nodeItem.folder === 'True' && nodeItem.itemId === folderId) {
          treeNode = treeNode[nodeItemInd].folderContents;
          successfulSteps++;
          return true;
        } else {
          return false;
        }
      });
    }

    if (successfulSteps != this.folderIdPath.length + relativeIndDiff) {
      throw 'folder ID path mismatch error';
    }

    return treeNode

  }



  toggleFolderDeposit() {
    if (this.toggleFolderDepositButton.innerHTML == " off ") {
      this.folderbehindzindex = 1;
      //
      this.toggleFolderDepositButton.style.backgroundColor = "rgb(30, 144, 255)";
      this.toggleFolderDepositButton.innerHTML = " on ";
    } else {
      this.folderbehindzindex = 3;
      //
      this.toggleFolderDepositButton.style.backgroundColor = "rgb(211, 211, 211)";
      this.toggleFolderDepositButton.innerHTML = " off ";
    }
    //    toggleFolderDepositButton

  }


  getLatestJSON() {
    return this.dirTreeJSON;
  }


  getLatestFolderIdPath() {
    return this.folderIdPath;
  }

  handleDropBackBox(e: any) { // this is only for folders since when dropping stuff onto files itll use the behind grid

    //  console.log("huh????2222222?")
    //  console.log(this)
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    //    console.log("ok?????????????")
    if (this.folderIdPath.length > 0) {
      let treeNode = this.getNodeJSON(0);
      let prevTreeNode = this.getNodeJSON(-1);
      let itemInd;

      treeNode.some( (nodeItem: any, nodeItemInd: any)=> {
        // @ts-ignore
        if (nodeItem.itemId === this.dragSrcEl.id) {
          itemInd = nodeItemInd;
          return true;
        } else{return false;}
      })

      let moveItem = treeNode.splice(itemInd, 1)[0];
      // @ts-ignore
      let srcBehindBefore = document.getElementById(this.dragSrcEl.id + "_0");
      // @ts-ignore
      let srcBehindAfter = document.getElementById(this.dragSrcEl.id + "_1");
      prevTreeNode.push(moveItem);
      // @ts-ignore
      this.dragSrcEl.remove();
      // @ts-ignore
      srcBehindBefore.remove();
      // @ts-ignore
      srcBehindAfter.remove();

    }

    return false;
  }


  items:any;

  dirTreeJSON: any;

  folderIdPath = [];

  toggleFolderDepositButton: any;

  folderbehindzindex = 3;

  behindItems: any;


  loadTreeNode() {
    console.log("eeeeeeeeee")

    try {
      console.log($("#dirview"))
    } catch (e) {
      console.log(e)
    }
    $("#dirview").empty();
    $("#dirviewbehind").empty();
    console.log("fffffffffffff")
    var treeNode = this.getNodeJSON(0);


    console.log("788888888888")
    console.log(treeNode.type)

    treeNode.forEach(function (b: any) {
      if (b.folder === 'True') {
        //        console.log("hiii");
        $("#dirviewbehind").append('<div draggable="false" style="z-index:1" class="behindbox folderbehind behl" id="' + b.itemId + '_0"></div>');
        $("#dirviewbehind").append('<div draggable="false" style="z-index:1" class="behindbox folderbehind behr" id="' + b.itemId + '_1"></div>');
        $("#dirview").append('<div draggable="true" style="z-index:2" class="subgrid box folder" id="' + b.itemId + '">' + b.itemName + '</div>');
        //        $("#dirview").append('<div draggable="false" class="gap" id="'+b.itemId+'_1"></div>');
      } else if (b.folder == 'False') {
        //        console.log("hiii3333file");
        $("#dirviewbehind").append('<div draggable="false" class="behindbox behl" style="z-index:1" id="' + b.itemId + '_0"></div>');
        $("#dirviewbehind").append('<div draggable="false" class="behindbox behr" style="z-index:1" id="' + b.itemId + '_1"></div>');
        $("#dirview").append('<div draggable="true" style="z-index:2" class="subgrid box" id="' + b.itemId + '">' + b.itemName + '</div>');
        //        $("#dirview").append('<div draggable="false" class="gap" id="'+b.itemId+'_1"></div>');
      }
    })

    console.log("gggggtttttt")

    let items = document.querySelectorAll('.container .box');
    items.forEach( (item)=> {
      //        console.log(item)
      item.addEventListener('dragstart', this.handleDragStart, false);
      //
      item.addEventListener('dragend', this.handleDragEnd, false);
      if (item.classList.contains("folder")) {
        //            console.log(item)
        item.addEventListener('dragenter', this.handleDragEnter, false);
        item.addEventListener('dragover', this.handleDragOver, false);
        item.addEventListener('dragleave', this.handleDragLeave, false);
        item.addEventListener('drop', this.handleDrop, false);
      }
      item.addEventListener('dblclick', this.openItem);
    });


    let behindItems = document.querySelectorAll('.containerbehind .behindbox');
    behindItems.forEach( (behindItem) =>{
      //              item.addEventListener('dragstart', handleDragStart, false);
      behindItem.addEventListener('dragenter', this.handleDragEnter, false);
      behindItem.addEventListener('dragover', this.handleDragOverBehind, false);
      behindItem.addEventListener('dragleave', this.handleDragLeave, false);
      behindItem.addEventListener('drop', this.handleDropBehind, false);
      //              gapItem.addEventListener('dragend', handleDragEndGap, false);
    });

  };



  initUserGroupView(responseJSON: any, userGroupName: any) {
    console.log("11111111111111111")
    let contentHeader = document.getElementById('userGroupName');
    console.log("2222222222222222")
    // @ts-ignore
    contentHeader.innerHTML = userGroupName
    console.log("333333333333333")
    this.dirTreeJSON = responseJSON;
    // console.log("4444444444444")
    // console.log(dirTreeJSON)
    // dirTreeJSON = JSON.parse(responseJSON);
    let toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');

    console.log("HEeeeeeeeeeeeeeeeeee 111")

    this.loadTreeNode();

    console.log("777777")
    let backBox = document.getElementById("backbox");
    // @ts-ignore
    backBox.addEventListener('dblclick', this.prevNode, false);
    // @ts-ignore
    backBox.addEventListener('drop', this.handleDropBackBox, false);
    // @ts-ignore
    backBox.addEventListener('dragenter', this.handleDragEnter, false);
    // @ts-ignore
    backBox.addEventListener('dragover', this.handleDragOver, false);
    // @ts-ignore
    backBox.addEventListener('dragleave', this.handleDragLeave, false);

    console.log("H32d23d23111")

  };


}
