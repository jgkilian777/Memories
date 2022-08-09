package com.jgkilian777.memories.handleJSON;

import com.jgkilian777.memories.memory.Memory;
import com.jgkilian777.memories.memory.MemoryRepository;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class HandleJSON {

  Set<Memory> memories;
  MemoryRepository memoryRepository;

  Set<Memory> memoriesInTree = new HashSet<>();

  Integer itemIdCounter = 0;

  public HandleJSON(Set<Memory> memories, MemoryRepository memoryRepository){
    this.memories = memories;
    this.memoryRepository = memoryRepository;
  }

  public boolean verifyAndCleanDirTreeJSON(JSONObject dirTreeJSON){
    if (!(dirTreeJSON.keySet().size()==1) || !dirTreeJSON.keySet().contains("dirTree")){
      dirTreeJSON.clear();
      Collection<?> cleanTree = new ArrayList<>();
      dirTreeJSON.put("dirTree", cleanTree);
    } else { // prune bad data
      boolean somethingFailed = handleFolder(dirTreeJSON.getJSONArray("dirTree"));
      if (somethingFailed){
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

        memoryJSONObject.put("fileId", idString);
        memoryJSONObject.put("folder", "False");
        dirTreeJSONMainArray.put(memoryJSONObject);
        itemIdCounter++;
      }
    }
    return true;

  }

  public boolean handleFolder(JSONArray jsonArray){
    AtomicInteger iterIndex = new AtomicInteger(0);
    ArrayList<Integer> removeIndices = new ArrayList<>();
    AtomicBoolean somethingFailed = new AtomicBoolean(false);
    jsonArray.iterator().forEachRemaining(element -> {
      if (!(element instanceof JSONObject) || !((JSONObject) element).has("folder")){
        somethingFailed.set(true);
      }
      else {
        if ("True".equals(((JSONObject) element).get("folder"))){
          handleFolder((JSONArray) (((JSONObject) element).get("folderContents")));
        } else{
          Memory validAndAuthenticatedMemory = memoryValidAndAuthenticated((JSONObject) element);
          if (validAndAuthenticatedMemory==null){
            removeIndices.add(iterIndex.get());
          } else {
            memoriesInTree.add(validAndAuthenticatedMemory);
            // UPDATE ANY CHANGEABLE FIELDS IN JSON
            ((JSONObject) element).put("itemName", validAndAuthenticatedMemory.getName());
          }
        }
      }
      iterIndex.getAndIncrement();
    });
    for (int j = removeIndices.size()-1; j>=0; j--){
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
      return null;
    }
    Optional<Memory> optionalMemory = memoryRepository.findById(memoryFileJSON.getLong("fileId"));
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
