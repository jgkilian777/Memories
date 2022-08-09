
function initDragStartZindex(){
    if (dragging===true){
        let allBehindItems = document.querySelectorAll('.containerbehind_dnd .behindbox_dnd');
         behindItems.forEach(function(behindItem) {
            if (!behindItem.classList.contains("folderbehind_dnd")){
                behindItem.style.zIndex=3;
            } else if (folderbehindzindex===3){
                behindItem.style.zIndex=3;
            }
         });
     }
}

var dragging = false;
var dragSrcEl = null;

  function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    dragging=true
    setTimeout(initDragStartZindex,10);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDragOverBehind(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }


  function handleDragEnter(e) {
    this.classList.add('over_dnd');
  }

  function handleDragLeave(e) {
    this.classList.remove('over_dnd');
  }

  function handleDrop(e) { // this is only for folders since when dropping stuff onto files itll use the behind grid

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    if (dragSrcEl != this && (dragSrcEl && dragSrcEl.draggable===true)) {
        let treeNode = getNodeJSON(0);
        let itemInd;
        let folderInd;
        treeNode.some(function (nodeItem, nodeItemInd) {
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
        if (!(folderInd===undefined)){
            let folderContents = treeNode[folderInd].folderContents;
            let srcBehindBefore = document.getElementById(dragSrcEl.id+"_0");
            let srcBehindAfter = document.getElementById(dragSrcEl.id+"_1");
            let moveItem = treeNode.splice(itemInd, 1)[0];
            folderContents.push(moveItem);
            dragSrcEl.remove();
            srcBehindBefore.remove();
            srcBehindAfter.remove();
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
        destBehindAfter.after(srcBehindAfter);
        destBehindAfter.after(srcBehindBefore);
      }
    }
    return false;
  }


  function handleDragEnd(e) {
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


function openItem(e){
    let openItemId = this.id;
    var _this = this

    let treeNode = getNodeJSON(0);
    treeNode.some(function (nodeItem, nodeItemInd) {
        if (nodeItem.itemId==openItemId){
            if (nodeItem.folder==="True"){
                openFolder(_this, e, nodeItem);
            } else if (nodeItem.folder=="False"){
                openFileFromAngular(nodeItem, usergroupId);
            }
            return true;
        } else {
            return false;
        }
    });
  }

function prevNode(){
    folderIdPath.pop();
    loadTreeNode();
    return
}

function getNodeJSON(relativeIndDiff) {
    var successfulSteps = 0;
    var treeNode = dirTreeJSON.dirTree;
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
        throw 'folder ID path mismatch error2';
    }
    return treeNode
}


function toggleFolderDeposit() {
    if (toggleFolderDepositButton.innerHTML===" off "){
        folderbehindzindex = 1;
        toggleFolderDepositButton.style.backgroundColor = "rgb(30, 144, 255)";
        toggleFolderDepositButton.innerHTML=" on ";
    } else {
        folderbehindzindex = 3;
        toggleFolderDepositButton.style.backgroundColor = "rgb(211, 211, 211)";
        toggleFolderDepositButton.innerHTML=" off ";
    }
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
       if (e.stopPropagation) {
         e.stopPropagation(); // stops the browser from redirecting.
       }
  if (!dragSrcEl || !dragSrcEl.draggable===true){
    return false;
  }
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
    $("#dirview_dnd").empty();
    $("#dirviewbehind_dnd").empty();

    var treeNode = getNodeJSON(0);

    treeNode.forEach(function(b) {
    if (b.folder === 'True'){

        $("#dirviewbehind_dnd").append('<div draggable="false" style="z-index:1" class="behindbox_dnd folderbehind_dnd behl_dnd" id="'+b.itemId+'_0"></div>');
        $("#dirviewbehind_dnd").append('<div draggable="false" style="z-index:1" class="behindbox_dnd folderbehind_dnd behr_dnd" id="'+b.itemId+'_1"></div>');
        $("#dirview_dnd").append('<div draggable="'+userCanDrag+'" style="z-index:2" class="subgrid_dnd box_dnd folder_dnd" id="'+b.itemId+'">'+b.itemName+'</div>');

    } else if (b.folder == 'False'){

        $("#dirviewbehind_dnd").append('<div draggable="false" class="behindbox_dnd behl_dnd" style="z-index:1" id="'+b.itemId+'_0"></div>');
        $("#dirviewbehind_dnd").append('<div draggable="false" class="behindbox_dnd behr_dnd" style="z-index:1" id="'+b.itemId+'_1"></div>');
        $("#dirview_dnd").append('<div draggable="'+userCanDrag+'" style="z-index:2" class="subgrid_dnd box_dnd" id="'+b.itemId+'">'+b.itemName+'</div>');
    }})

    items = document.querySelectorAll('.container_dnd .box_dnd');
      items.forEach(function(item) {

        item.addEventListener('dragstart', handleDragStart, false);

        item.addEventListener('dragend', handleDragEnd, false);
        if (item.classList.contains("folder_dnd")){

            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
        }
        item.addEventListener('dblclick', openItem);
      });


      behindItems = document.querySelectorAll('.containerbehind_dnd .behindbox_dnd');
            behindItems.forEach(function(behindItem) {

              behindItem.addEventListener('dragenter', handleDragEnter, false);
              behindItem.addEventListener('dragover', handleDragOverBehind, false);
              behindItem.addEventListener('dragleave', handleDragLeave, false);
              behindItem.addEventListener('drop', handleDropBehind, false);
            });
}




function initUserGroupView(responseJSON, userGroupName, userCanDragInp, openFileFromAngularFunc, usergroupIdInp) {
  let contentHeader = document.getElementById('userGroupName');
  contentHeader.innerHTML = userGroupName
  dirTreeJSON = responseJSON;
  toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');

  usergroupId = usergroupIdInp;

  userCanDrag=userCanDragInp;
  openFileFromAngular=openFileFromAngularFunc;

      loadTreeNode();

      let backBox = document.getElementById("backbox_dnd");
      backBox.addEventListener('dblclick', prevNode, false);
      backBox.addEventListener('drop', handleDropBackBox, false);
      backBox.addEventListener('dragenter', handleDragEnter, false);
      backBox.addEventListener('dragover', handleDragOver, false);
      backBox.addEventListener('dragleave', handleDragLeave, false);

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


module.exports = {toggleFolderDeposit, loadTreeNode, initUserGroupView, getLatestJSON, getLatestFolderIdPath, clearLatestFolderIdPath, clearUserGroupView};
