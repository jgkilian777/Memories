//var dirTreeString = '{"dirTree":['+
//  '{"itemName":"file1", "fileId":"13214", "folder":"False"},'+
//  '{"itemName":"file2", "fileId":"123551", "folder":"False"},'+
//  '{"itemName":"folder1", "folder":"True", "folderContents":['+
//
//    '{"itemName":"file4", "fileId":"133e214aa", "folder":"False"},'+
//    '{"itemName":"file5", "fileId":"1235t451daa", "folder":"False"},'+
//    '{"itemName":"folder2", "folder":"True", "folderContents":[]}'+
//
//  ']}'+
//']}';

//<div draggable="true" class="box">A</div>
//<div draggable="true" class="box folder">Folder D</div>

//var dirTreeJSON = JSON.parse(dirTreeString);
//dirTreeJSON.dirTree.forEach(function(b) {
//    if (b.folder == 'True'){
//        console.log("hiii");
//        $("#dirview").append('<div draggable="true" class="box folder">${b.itemName}</div>');
//    } else if (b.folder == 'False'){
//        console.log("hiii3333file");
//        $("#dirview").append('<div draggable="true" class="box">${b.itemName}</div>');
//    }
//
//
//});

//$( ".inner" ).append( "<p>Test</p>" );
function initDragStartZindex(){
//    console.log("DOING THING111111");
    if (dragging===true){

        let allBehindItems = document.querySelectorAll('.containerbehind .behindbox');

         behindItems.forEach(function(behindItem) {
            if (!behindItem.classList.contains("folderbehind")){
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

    e.dataTransfer.effectAllowed = 'move';
    dragging=true
    setTimeout(initDragStartZindex,10);

//     console.log(this);
//     console.log(this.style.opacity);
//     console.log("weird asf drag");
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
    this.classList.add('over');
  }

  function handleDragLeave(e) {
//  console.log(555);
    this.classList.remove('over');
  }

  function handleDrop(e) { // this is only for folders since when dropping stuff onto files itll use the behind grid

//  console.log("huh????2222222?")
//  console.log(this)
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
//    console.log("ok?????????????")
    if (dragSrcEl != this) {
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


    if (srcIndex != destIndex && (srcIndex+1 != destIndex || beforeAfter==='1') && (srcIndex-1 != destIndex || beforeAfter==='0')) {

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
    dragging=false
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });

    let allBehindItems = document.querySelectorAll('.containerbehind .behindbox');
     behindItems.forEach(function(behindItem) {
        behindItem.style.zIndex=1;
        behindItem.classList.remove('over');
     });



  }


  function openFolder(_this, e, nodeItem){
//    this.innerHTML="folder opened";
//    let openFolderId = this.
//    console.log("nodeItem:");
//    console.log(nodeItem);
    folderIdPath.push(nodeItem.itemId);
    loadTreeNode();

  }

  function openFile(_this, e, nodeItem){
//    console.log("hmm1");
//    console.log(this);
    _this.innerHTML="file opened";
  }


function openItem(e){
    let openItemId = this.id;
//    console.log(this);
    var _this = this
//    console.log(_this);
//    console.log("_???????");

    let treeNode = getNodeJSON(0);
    treeNode.some(function (nodeItem, nodeItemInd) {
//        console.log(this);
        if (nodeItem.itemId==openItemId){
            if (nodeItem.folder=="True"){
                openFolder(_this, e, nodeItem);
            } else if (nodeItem.folder=="False"){
//                console.log(this);
                openFile(_this, e, nodeItem);
            }
            return true;
        } else {
            return false;
        }
    });
//    this.innerHTML=openItemId;
//    folderIdPath.append();

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
    let start=0;
    let finish=folderIdPath.length + relativeIndDiff;
    let i;

    for (i=start; i<finish; i++){
        let folderId = folderIdPath[i];
        treeNode.some(function (nodeItem, nodeItemInd) {
            if (nodeItem.folder=='True' && nodeItem.itemId==folderId){
                treeNode=treeNode[nodeItemInd].folderContents;
                successfulSteps++;
                return true;
            } else {
                return false;
            }
        });
    }

    if (successfulSteps!=folderIdPath.length + relativeIndDiff){
        throw 'folder ID path mismatch error';
    }

    return treeNode

}


function toggleFolderDeposit() {
    if (toggleFolderDepositButton.innerHTML==" off "){
        folderbehindzindex = 1;
//        behindItems = document.querySelectorAll('.containerbehind');
//        behindItems.forEach(function(behindItem) {
//            behindItem.zIndex = folderbehindzindex;
//        });
        toggleFolderDepositButton.style.backgroundColor = "rgb(30, 144, 255)";
        toggleFolderDepositButton.innerHTML=" on ";
    } else {
        folderbehindzindex = 3;
//        behindItems = document.querySelectorAll('.containerbehind');
//        behindItems.forEach(function(behindItem) {
//            behindItem.zIndex = folderbehindzindex;
//        });
        toggleFolderDepositButton.style.backgroundColor = "rgb(211, 211, 211)";
        toggleFolderDepositButton.innerHTML=" off ";
    }
//    toggleFolderDepositButton

}

function handleDropBackBox (e) { // this is only for folders since when dropping stuff onto files itll use the behind grid

   //  console.log("huh????2222222?")
   //  console.log(this)
       if (e.stopPropagation) {
         e.stopPropagation(); // stops the browser from redirecting.
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

function loadTreeNode() {
    $("#dirview").empty();
    $("#dirviewbehind").empty();
//    console.log('????');
//    var treeNode = dirTreeJSON.dirTree;
    var treeNode = getNodeJSON(0);

//    folderIdPath.forEach(function (folderId) {
//        treeNode.some(function (nodeItem, nodeItemInd) {
//            if (nodeItem.folder=='True' && nodeItem.itemId==folderId){
//                treeNode=treeNode[nodeItemInd].folderContents;
//                successfulSteps++;
//                return true;
//            } else {
//                return false;
//            }
//        });
//
//
//    });
//    if (successfulSteps!=folderIdPath.length){
//        throw 'folder ID path mismatch error';
//    }


    treeNode.forEach(function(b) {
    if (b.folder == 'True'){
//        console.log("hiii");
        $("#dirviewbehind").append('<div draggable="false" style="z-index:1" class="behindbox folderbehind behl" id="'+b.itemId+'_0"></div>');
        $("#dirviewbehind").append('<div draggable="false" style="z-index:1" class="behindbox folderbehind behr" id="'+b.itemId+'_1"></div>');
        $("#dirview").append('<div draggable="true" style="z-index:2" class="subgrid box folder" id="'+b.itemId+'">'+b.itemName+'</div>');
//        $("#dirview").append('<div draggable="false" class="gap" id="'+b.itemId+'_1"></div>');
    } else if (b.folder == 'False'){
//        console.log("hiii3333file");
        $("#dirviewbehind").append('<div draggable="false" class="behindbox behl" style="z-index:1" id="'+b.itemId+'_0"></div>');
        $("#dirviewbehind").append('<div draggable="false" class="behindbox behr" style="z-index:1" id="'+b.itemId+'_1"></div>');
        $("#dirview").append('<div draggable="true" style="z-index:2" class="subgrid box" id="'+b.itemId+'">'+b.itemName+'</div>');
//        $("#dirview").append('<div draggable="false" class="gap" id="'+b.itemId+'_1"></div>');
    }})



    items = document.querySelectorAll('.container .box');
      items.forEach(function(item) {
//        console.log(item)
        item.addEventListener('dragstart', handleDragStart, false);
//        item.addEventListener('dragenter', handleDragEnter, false);
//        item.addEventListener('dragover', handleDragOver, false);
//        item.addEventListener('dragleave', handleDragLeave, false);
//        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
        if (item.classList.contains("folder")){
//            console.log(item)
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
        }
        item.addEventListener('dblclick', openItem);
      });


      behindItems = document.querySelectorAll('.containerbehind .behindbox');
            behindItems.forEach(function(behindItem) {
//              item.addEventListener('dragstart', handleDragStart, false);
              behindItem.addEventListener('dragenter', handleDragEnter, false);
              behindItem.addEventListener('dragover', handleDragOverBehind, false);
              behindItem.addEventListener('dragleave', handleDragLeave, false);
              behindItem.addEventListener('drop', handleDropBehind, false);
//              gapItem.addEventListener('dragend', handleDragEndGap, false);
            });






};




export function initUserGroupView(responseJSON) {
  dirTreeJSON = responseJSON;
  toggleFolderDepositButton = document.getElementById('toggleFolderDepositButton');

//  var dirTreeString = '{"dirTree":['+
//    '{"itemName":"file1", "itemId":"4", "fileId":"23odi23jid3", "folder":"False"},'+
//    '{"itemName":"file2", "itemId":"3", "fileId":"2v2c3c2v", "folder":"False"},'+
//    '{"itemName":"file6", "itemId":"7", "fileId":"2v2c3t3c2v", "folder":"False"},'+
//    '{"itemName":"folder1", "itemId":"1", "folder":"True", "folderContents":['+
//
//      '{"itemName":"file3", "itemId":"5", "fileId":"vv4iii6t52deg", "folder":"False"},'+
//      '{"itemName":"file5", "itemId":"6", "fileId":"jj66n6n44gg", "folder":"False"},'+
//      '{"itemName":"folder2", "itemId":"2", "folder":"True", "folderContents":[]}'+
//
//    ']},'+
//    '{"itemName":"folder3", "itemId":"8", "folder":"True", "folderContents":['+
//
//      '{"itemName":"file4", "itemId":"10", "fileId":"vv4vb6nt52deg", "folder":"False"},'+
//      '{"itemName":"file7", "itemId":"11", "fileId":"jj6v3644gg", "folder":"False"},'+
//      '{"itemName":"folder4", "itemId":"9", "folder":"True", "folderContents":[]}'+
//
//    ']}'+
//  ']}';

//    var dirTreeString =


//  dirTreeJSON = JSON.parse(dirTreeString);


  // get list of files in json, if file isnt available anymore, dont add to list, just remove from json and ideally save to db later before user leaves
  // checking shouldnt be as slow as iterating list of available items, should be O(1) checking db or something



  // compare to list of available files (will code getting it from db later)

  // all remaining files not in json, put in dirTreeJSON.dirTree

  // maybe save to db here? at least if something was different obv...





//  console.log(dirTreeJSON)
//  dirTreeJSON.dirTree.forEach(function(b) {
//      if (b.folder == 'True'){
//          console.log("hiii");
//          $("#dirview").append('<div draggable="true" class="box folder">'+b.itemName+'</div>');
//      } else if (b.folder == 'False'){
//          console.log("hiii3333file");
//          $("#dirview").append('<div draggable="true" class="box">'+b.itemName+'</div>');
//      }
//
//
//  });



//    let backBox = document.getElementById("backbox");
//    backBox.addEventListener('dblclick', prevNode, false);
//    backBox.addEventListener('drop', handleDropBackBox, false);
//    backBox.addEventListener('dragenter', handleDragEnter, false);
//    backBox.addEventListener('dragover', handleDragOver, false);
//    backBox.addEventListener('dragleave', handleDragLeave, false);









//  let items = document.querySelectorAll('.container .box');
//  items.forEach(function(item) {
//    item.addEventListener('dragstart', handleDragStart, false);
//    item.addEventListener('dragenter', handleDragEnter, false);
//    item.addEventListener('dragover', handleDragOver, false);
//    item.addEventListener('dragleave', handleDragLeave, false);
//    item.addEventListener('drop', handleDrop, false);
//    item.addEventListener('dragend', handleDragEnd, false);
//    if (item.classList.contains("folder")){
//        item.addEventListener("dblclick", openFolder);
//    } else {
//        item.addEventListener("dblclick", openFile);
//    }
//  });

      loadTreeNode();


      let backBox = document.getElementById("backbox");
      backBox.addEventListener('dblclick', prevNode, false);
      backBox.addEventListener('drop', handleDropBackBox, false);
      backBox.addEventListener('dragenter', handleDragEnter, false);
      backBox.addEventListener('dragover', handleDragOver, false);
      backBox.addEventListener('dragleave', handleDragLeave, false);

      document.getElementById('saveJSONbutton').onclick = saveJSON();
      document.getElementById('toggleFolderDepositButton').onclick = toggleFolderDeposit();




//    loadTreeNode();

};


