// import * as $ from "jquery";
// import {$, jquery} from "jquery";
// import 'bootstrap';
// import {$, jquery} from "jquery";
// var $;

function initDragStartZindex(){
//    console.log("DOING THING111111");
    if (dragging===true){

        let allBehindItems = document.querySelectorAll('.containerbehind_dnd .behindbox_dnd');

         behindItems.forEach(function(behindItem) {
            if (!behindItem.classList.contains("folderbehind_dnd")){
                behindItem.style.zIndex=3;

            } else if (folderbehindzindex===3){

//                console.log(behindItem.style.zIndex);
                behindItem.style.zIndex=3;
//                console.log(behindItem.style.zIndex);
            }

         });
     }
}
var dragging = false;
var dragSrcEl = null;

  function handleDragStart(e) {
    this.style.opacity = '0.4';
//    console.log("starting drag");

    dragSrcEl = this;
    // console.log("HELLO OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    // console.log(this);
    // console.log(dragSrcEl);

    e.dataTransfer.effectAllowed = 'move';
    dragging=true
    setTimeout(initDragStartZindex,10);


  }

  function handleDragOver(e) {
    console.log(222);
//    console.log(this);
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDragOverBehind(e) {
//        console.log(this);
        console.log(333);
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }


  function handleDragEnter(e) {
//    console.log(444);
    this.classList.add('over_dnd');
  }

  function handleDragLeave(e) {
//  console.log(555);
    this.classList.remove('over_dnd');
  }

  function handleDrop(e) { // this is only for folders since when dropping stuff onto files itll use the behind grid

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }


//    console.log("ok?????????????")
//     console.log(dragSrcEl);
    // console.log(dragSrcEl.draggable);
    if (dragSrcEl != this && (dragSrcEl && dragSrcEl.draggable===true)) {
        let treeNode = getNodeJSON(0);
        let itemInd;
        let folderInd;
//        console.log(this)
        treeNode.some(function (nodeItem, nodeItemInd) {
//            console.log(nodeItem.itemId)
//            console.log("huhh3333333333??")
//            console.log(this)
            if (nodeItem.itemId === this.id) {
                if (nodeItem.folder==="True"){
                    folderInd = nodeItemInd;

                }
                return true;
            }
        }, this)
        treeNode.some(function (nodeItem, nodeItemInd) {
            if (nodeItem.itemId === dragSrcEl.id) {
                itemInd = nodeItemInd;
                return true;
            }
        })
//        console.log("ok?????????????")
//        console.log(folderInd)
        if (!(folderInd===undefined)){
            let folderContents = treeNode[folderInd].folderContents;
            let srcBehindBefore = document.getElementById(dragSrcEl.id+"_0");
            let srcBehindAfter = document.getElementById(dragSrcEl.id+"_1");
//            console.log(folderContents)
            let moveItem = treeNode.splice(itemInd, 1)[0];
            folderContents.push(moveItem);
            dragSrcEl.remove();
            srcBehindBefore.remove();
            srcBehindAfter.remove();
//            console.log("ok?????????????")
        }
    }

    return false;
  }


function handleDropBehind(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    if (!dragSrcEl || !dragSrcEl.draggable===true){
      return false;
    }

    let [destId, beforeAfter] = this.id.split("_");
    let srcIndex;
    let destIndex;

    let treeNode = getNodeJSON(0);
    console.log(treeNode);
    treeNode.some(function (nodeItem, nodeItemInd) {
        if (nodeItem.itemId === destId) {
            destIndex=nodeItemInd;
            return true;
        }
    })

    treeNode.some(function (nodeItem, nodeItemInd) {
        if (nodeItem.itemId === dragSrcEl.id) {
            srcIndex=nodeItemInd;
            return true;
        }
    })

    if (srcIndex===undefined || destIndex===undefined){
        throw 'someone is editing html elements error';
    }


    if (srcIndex !== destIndex && (srcIndex+1 !== destIndex || beforeAfter==='1') && (srcIndex-1 !== destIndex || beforeAfter==='0')) {

      let srcItemJSON = treeNode[srcIndex];
      let destElement = document.getElementById(destId);
      if (beforeAfter==='0'){
//        console.log(this);
//        console.log(dragSrcEl);
        treeNode.splice(srcIndex, 1);
        if (srcIndex<destIndex){
            treeNode.splice(destIndex-1, 0, srcItemJSON);
        } else{
            treeNode.splice(destIndex, 0, srcItemJSON);
        }

        destElement.before(dragSrcEl);

        let srcBehindBefore = document.getElementById(dragSrcEl.id+"_0");
        let srcBehindAfter = document.getElementById(dragSrcEl.id+"_1");
        let destBehindBefore = this;
//        let destBehindAfter = this.nextSibling;
        destBehindBefore.before(srcBehindBefore);
        destBehindBefore.before(srcBehindAfter);

      } else if (beforeAfter==='1'){
        treeNode.splice(srcIndex, 1);
        if (srcIndex<destIndex){
            treeNode.splice(destIndex, 0, srcItemJSON);
        } else{
            treeNode.splice(destIndex+1, 0, srcItemJSON);
        }

        destElement.after(dragSrcEl);

        let srcBehindBefore = document.getElementById(dragSrcEl.id+"_0");
        let srcBehindAfter = document.getElementById(dragSrcEl.id+"_1");
        let destBehindAfter = this;
//        let destBehindBefore = this.previousSibling;
        destBehindAfter.after(srcBehindAfter);
        destBehindAfter.after(srcBehindBefore);


      }

    }

    return false;
  }


  function handleDragEnd(e) {
//    console.log(this);
//     console.log("OKAY THIS IS WORKING................")
    dragging=false
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over_dnd');
    });

    let allBehindItems = document.querySelectorAll('.containerbehind_dnd .behindbox_dnd');
     behindItems.forEach(function(behindItem) {
        behindItem.style.zIndex=1;
        behindItem.classList.remove('over_dnd');
     });

    dragSrcEl=null;
  }

  function openFolder(_this, e, nodeItem){

    folderIdPath.push(nodeItem.itemId);
    loadTreeNode();

  }

  // function openFile(_this, e, nodeItem){
  //   _this.innerHTML="file opened";
  // }


function openItem(e){
    let openItemId = this.id;
//    console.log(this);
    var _this = this

    let treeNode = getNodeJSON(0);
    treeNode.some(function (nodeItem, nodeItemInd) {
//        console.log(this);
        if (nodeItem.itemId==openItemId){
            if (nodeItem.folder==="True"){
                openFolder(_this, e, nodeItem);
            } else if (nodeItem.folder=="False"){
//                console.log(this);
//                 openFile(_this, e, nodeItem);
                openFileFromAngular(_this, e, nodeItem, usergroupId);
            }
            return true;
        } else {
            return false;
        }
    });

  }

function prevNode(){
//    pop then getNodeJSON()?
    folderIdPath.pop();
    loadTreeNode();
    return
}

function getNodeJSON(relativeIndDiff) {
    var successfulSteps = 0;
    var treeNode = dirTreeJSON.dirTree;
    console.log(dirTreeJSON)
    console.log(dirTreeJSON.dirTree)
    console.log(typeof dirTreeJSON.dirTree)
    let start=0;
    let finish=folderIdPath.length + relativeIndDiff;
    let i;

    for (i=start; i<finish; i++){
        let folderId = folderIdPath[i];
        treeNode.some(function (nodeItem, nodeItemInd) {
            if (nodeItem.folder==='True' && nodeItem.itemId===folderId){
                treeNode=treeNode[nodeItemInd].folderContents;
                successfulSteps++;
                return true;
            } else {
                return false;
            }
        });
    }

    if (successfulSteps!==folderIdPath.length + relativeIndDiff){
        console.log(folderIdPath);
        console.log("YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        throw 'folder ID path mismatch error2';
    }

    return treeNode

}


function toggleFolderDeposit() {
    if (toggleFolderDepositButton.innerHTML===" off "){
        folderbehindzindex = 1;
//
        toggleFolderDepositButton.style.backgroundColor = "rgb(30, 144, 255)";
        toggleFolderDepositButton.innerHTML=" on ";
    } else {
        folderbehindzindex = 3;
//
        toggleFolderDepositButton.style.backgroundColor = "rgb(211, 211, 211)";
        toggleFolderDepositButton.innerHTML=" off ";
    }
//    toggleFolderDepositButton

}

function getLatestJSON(){
    return dirTreeJSON;
}

function getLatestFolderIdPath(){
    return folderIdPath;
}

function clearLatestFolderIdPath(){
    folderIdPath=[];
}

function handleDropBackBox (e) { // this is only for folders since when dropping stuff onto files itll use the behind grid

   //  console.log("huh????2222222?")
   //  console.log(this)
       if (e.stopPropagation) {
         e.stopPropagation(); // stops the browser from redirecting.
       }
  if (!dragSrcEl || !dragSrcEl.draggable===true){
    return false;
  }

   //    console.log("ok?????????????")
       if (folderIdPath.length>0){
           let treeNode = getNodeJSON(0);
           let prevTreeNode = getNodeJSON(-1);
           let itemInd;

           treeNode.some(function (nodeItem, nodeItemInd) {
               if (nodeItem.itemId === dragSrcEl.id) {
                   itemInd = nodeItemInd;
                   return true;
               }
           })

           let moveItem = treeNode.splice(itemInd, 1)[0];
           let srcBehindBefore = document.getElementById(dragSrcEl.id+"_0");
           let srcBehindAfter = document.getElementById(dragSrcEl.id+"_1");
           prevTreeNode.push(moveItem);
           dragSrcEl.remove();
           srcBehindBefore.remove();
           srcBehindAfter.remove();

       }

       return false;
     }


let items;
var dirTreeJSON;
let folderIdPath=[];
let toggleFolderDepositButton;
let folderbehindzindex = 3;
let behindItems;
let userCanDrag;
let openFileFromAngular;
let usergroupId;


function loadTreeNode() {
  console.log("eeeeeeeeee")

  try{
    console.log($("#dirview_dnd"))
  } catch (e) {
    console.log(e)
  }
    $("#dirview_dnd").empty();
    $("#dirviewbehind_dnd").empty();
  console.log("fffffffffffff")
    var treeNode = getNodeJSON(0);


  console.log("788888888888")
  console.log(treeNode.type)

    treeNode.forEach(function(b) {
    if (b.folder === 'True'){
//        console.log("hiii");
        $("#dirviewbehind_dnd").append('<div draggable="false" style="z-index:1" class="behindbox_dnd folderbehind_dnd behl_dnd" id="'+b.itemId+'_0"></div>');
        $("#dirviewbehind_dnd").append('<div draggable="false" style="z-index:1" class="behindbox_dnd folderbehind_dnd behr_dnd" id="'+b.itemId+'_1"></div>');
        $("#dirview_dnd").append('<div draggable="'+userCanDrag+'" style="z-index:2" class="subgrid_dnd box_dnd folder_dnd" id="'+b.itemId+'">'+b.itemName+'</div>');
//        $("#dirview").append('<div draggable="false" class="gap" id="'+b.itemId+'_1"></div>');
    } else if (b.folder == 'False'){
//        console.log("hiii3333file");
        $("#dirviewbehind_dnd").append('<div draggable="false" class="behindbox_dnd behl_dnd" style="z-index:1" id="'+b.itemId+'_0"></div>');
        $("#dirviewbehind_dnd").append('<div draggable="false" class="behindbox_dnd behr_dnd" style="z-index:1" id="'+b.itemId+'_1"></div>');
        $("#dirview_dnd").append('<div draggable="'+userCanDrag+'" style="z-index:2" class="subgrid_dnd box_dnd" id="'+b.itemId+'">'+b.itemName+'</div>');
//        $("#dirview").append('<div draggable="false" class="gap" id="'+b.itemId+'_1"></div>');
    }})

  console.log("gggggtttttt")

    items = document.querySelectorAll('.container_dnd .box_dnd');
      items.forEach(function(item) {
//        console.log(item)
        item.addEventListener('dragstart', handleDragStart, false);
//
        item.addEventListener('dragend', handleDragEnd, false);
        if (item.classList.contains("folder_dnd")){
//            console.log(item)
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
        }
        item.addEventListener('dblclick', openItem);
      });


      behindItems = document.querySelectorAll('.containerbehind_dnd .behindbox_dnd');
            behindItems.forEach(function(behindItem) {
//              item.addEventListener('dragstart', handleDragStart, false);
              behindItem.addEventListener('dragenter', handleDragEnter, false);
              behindItem.addEventListener('dragover', handleDragOverBehind, false);
              behindItem.addEventListener('dragleave', handleDragLeave, false);
              behindItem.addEventListener('drop', handleDropBehind, false);
//              gapItem.addEventListener('dragend', handleDragEndGap, false);
            });

};




function initUserGroupView(responseJSON, userGroupName, userCanDragInp, openFileFromAngularFunc, usergroupIdInp) {
  console.log("11111111111111111")
  let contentHeader = document.getElementById('userGroupName');
  console.log("2222222222222222")
  contentHeader.innerHTML = userGroupName
  console.log("333333333333333")
  dirTreeJSON = responseJSON;
  console.log("4444444444444")
  console.log(dirTreeJSON)
  // dirTreeJSON = JSON.parse(responseJSON);
  toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');

  usergroupId = usergroupIdInp;

  userCanDrag=userCanDragInp;
  openFileFromAngular=openFileFromAngularFunc;

  console.log("HEeeeeeeeeeeeeeeeeee 111")

      loadTreeNode();

  console.log("777777")
      let backBox = document.getElementById("backbox_dnd");
      backBox.addEventListener('dblclick', prevNode, false);
      backBox.addEventListener('drop', handleDropBackBox, false);
      backBox.addEventListener('dragenter', handleDragEnter, false);
      backBox.addEventListener('dragover', handleDragOver, false);
      backBox.addEventListener('dragleave', handleDragLeave, false);

  console.log("H32d23d23111")

}


function clearUserGroupView() {
  let contentHeader = document.getElementById('userGroupName');
  contentHeader.innerHTML = "";
  dirTreeJSON = undefined;
  toggleFolderDepositButton = undefined;

  usergroupId = undefined;

  userCanDrag=undefined;
  openFileFromAngular=undefined;


  $("#dirview_dnd").empty();
  $("#dirviewbehind_dnd").empty();



}



// (function( $ ){
//   console.log("???????????????wwDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDwww");
//   $.fn.fitText = function( kompressor, options ) {
//     console.log("???????????????wwDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDwww");
//     // Setup options
//     var compressor = kompressor || 1,
//       settings = $.extend({
//         'minFontSize' : Number.NEGATIVE_INFINITY,
//         'maxFontSize' : Number.POSITIVE_INFINITY
//       }, options);
//
//     return this.each(function(){
//       console.log("???????????????wwDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDwww");
//       // Store the object
//       var $this = $(this);
//
//       // Resizer() resizes items based on the object width divided by the compressor * 10
//       var resizer = function () {
//         console.log("???????????????wwwww");
//         $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
//
//       };
//
//       // Call once to set.
//
//         resizer();
//
//       // Call on resize. Opera debounces their resize by default.
//       $(window).on('resize.fittext orientationchange.fittext', resizer);
//
//     });
//
//   };
//
// })( jQuery );



module.exports = {toggleFolderDeposit, loadTreeNode, initUserGroupView, getLatestJSON, getLatestFolderIdPath, clearLatestFolderIdPath, clearUserGroupView};
