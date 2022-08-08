package com.jgkilian777.memories.handleJSON;

import com.jgkilian777.memories.memory.Memory;
import com.jgkilian777.memories.memory.MemoryRepository;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;


//var dirTreeString = '{"dirTree":['+
//  '{"itemName":"file1", "itemId":"4", "fileId":"23odi23jid3", "folder":"False"},'+
//  '{"itemName":"file2", "itemId":"3", "fileId":"2v2c3c2v", "folder":"False"},'+
//  '{"itemName":"file6", "itemId":"7", "fileId":"2v2c3t3c2v", "folder":"False"},'+
//  '{"itemName":"folder1", "itemId":"1", "folder":"True", "folderContents":['+
//
//  '{"itemName":"file3", "itemId":"5", "fileId":"vv4iii6t52deg", "folder":"False"},'+
//  '{"itemName":"file5", "itemId":"6", "fileId":"jj66n6n44gg", "folder":"False"},'+
//  '{"itemName":"folder2", "itemId":"2", "folder":"True", "folderContents":[]}'+
//
//  ']},'+
//  '{"itemName":"folder3", "itemId":"8", "folder":"True", "folderContents":['+
//
//  '{"itemName":"file4", "itemId":"10", "fileId":"vv4vb6nt52deg", "folder":"False"},'+
//  '{"itemName":"file7", "itemId":"11", "fileId":"jj6v3644gg", "folder":"False"},'+
//  '{"itemName":"folder4", "itemId":"9", "folder":"True", "folderContents":[]}'+
//
//  ']}'+
//  ']}';



public class HandleJSON {


//  private Object baseJSON;
//
//  public handleJSON(Object baseJSON){
//    this.baseJSON = baseJSON;
//  }
  Set<Memory> memories;
  MemoryRepository memoryRepository;

  Set<Memory> memoriesInTree = new HashSet<>();

  Integer itemIdCounter = 0;

  public HandleJSON(Set<Memory> memories, MemoryRepository memoryRepository){
    this.memories = memories;
    this.memoryRepository = memoryRepository;
  }


  public boolean verifyAndCleanDirTreeJSON(JSONObject dirTreeJSON){
    System.out.println(dirTreeJSON);
    if (!(dirTreeJSON.keySet().size()==1) || !dirTreeJSON.keySet().contains("dirTree")){
      System.out.println("here111");
      dirTreeJSON.clear();
      Collection<?> cleanTree = new ArrayList<>();
      dirTreeJSON.put("dirTree", cleanTree);
    } else { // prune bad data
      System.out.println("here222");
      boolean somethingFailed = handleFolder(dirTreeJSON.getJSONArray("dirTree"));
      if (somethingFailed){
        System.out.println("here somethingfailed 111");
        dirTreeJSON.clear();
        Collection<?> cleanTree = new ArrayList<>();
        dirTreeJSON.put("dirTree", cleanTree);
      }
    }
    // finally, add memories that arent anywhere in tree but are visible to usergroup
    JSONArray dirTreeJSONMainArray = dirTreeJSON.getJSONArray("dirTree");
    for (Memory userGroupMemory : memories){
      if(!memoriesInTree.contains(userGroupMemory)){
        Map<String, String> memoryJSONObject = new HashMap<>();
        memoryJSONObject.put("itemName", userGroupMemory.getName());

        memoryJSONObject.put("itemId", itemIdCounter.toString());

        String idString = Long.toString(userGroupMemory.getId());
//        if (idString==null){
//          throw new RuntimeException("memory id converted from long to string is somehow null")
//        }
        memoryJSONObject.put("fileId", idString);
        memoryJSONObject.put("folder", "False");
        dirTreeJSONMainArray.put(memoryJSONObject);
        itemIdCounter++;
      }
    }
    return true;

  }

//  int test3 = 1;
  public boolean handleFolder(JSONArray jsonArray){
    AtomicInteger iterIndex = new AtomicInteger(0);
    ArrayList<Integer> removeIndices = new ArrayList<>();
    AtomicBoolean somethingFailed = new AtomicBoolean(false);
    jsonArray.iterator().forEachRemaining(element -> {
//      handleValue(element, jsonArray, null);
//      test3++;
      if (!(element instanceof JSONObject) || !((JSONObject) element).has("folder")){
//        handleFolder((JSONArray) element);
        System.out.println(element);
        System.out.println(element.getClass().getName());
        somethingFailed.set(true);
      }
      else {
        if ("True".equals(((JSONObject) element).get("folder"))){
//          System.out.println("REALLY SHOULD BE HERE111");
          handleFolder((JSONArray) (((JSONObject) element).get("folderContents")));
        } else{
//          System.out.println("element and element get folder");
//          System.out.println(element);
//          System.out.println(((JSONObject) element).get("folder"));
//          System.out.println((((JSONObject) element).get("folder")=="True"));
          Memory validAndAuthenticatedMemory = memoryValidAndAuthenticated((JSONObject) element);
          if (validAndAuthenticatedMemory==null){
            System.out.println("okay111");
            removeIndices.add(iterIndex.get());
          } else {
            memoriesInTree.add(validAndAuthenticatedMemory);
            // UPDATE ANY CHANGEABLE FIELDS IN JSON
            ((JSONObject) element).put("itemName", validAndAuthenticatedMemory.getName());
          }
        }

      }
      iterIndex.getAndIncrement();
//      test3++;
    });
    for (int j = removeIndices.size()-1; j>=0; j--){
      System.out.println("okay4422");
      jsonArray.remove(removeIndices.get(j));
    }
    for (int j = 0; j < jsonArray.length(); j++){
      JSONObject optionalJSONObject = jsonArray.optJSONObject(j);
      if (optionalJSONObject!=null && optionalJSONObject.has("itemId")){
        optionalJSONObject.put("itemId", itemIdCounter.toString());
        itemIdCounter++;
      }
    }
  return somethingFailed.get();
  }

  private Memory memoryValidAndAuthenticated(JSONObject memoryFileJSON) {
    if (!memoryFileJSON.has("fileId")){
      System.out.println("okay44rrrrr1");
      System.out.println(memoryFileJSON);
      return null;
    }
    Optional<Memory> optionalMemory = memoryRepository.findById(memoryFileJSON.getLong("fileId"));
//    return optionalMemory.isPresent() && memories.contains(optionalMemory.get());
    if (optionalMemory.isPresent()){
      Memory memoryInstance = optionalMemory.get();
      if (memories.contains(memoryInstance)){
        return memoryInstance;
      } else{
        return null;
      }
    } else {
      return null;
    }
  }
}
