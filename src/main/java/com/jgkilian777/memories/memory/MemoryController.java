package com.jgkilian777.memories.memory;

import com.jgkilian777.memories.ResponseMessage;
import com.jgkilian777.memories.security.MessageResponse;
import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.user.UserDetailsImpl;
import com.jgkilian777.memories.user.UserRepository;
import com.jgkilian777.memories.userGroup.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RestController
public class MemoryController {

    @Autowired
    MemoryServiceImpl memoryService;

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserGroupServiceImpl userGroupService;

//    @GetMapping("/memories/{id}")
//    public Memory getMemory(@PathVariable("id") Long id){
//        return memoryService.getMemory(id);
//    }


  @GetMapping("/api/memories/{userGroupId}/{memoryId}")
  public ResponseEntity<byte[]> getMemoryInUserGroup(@PathVariable("userGroupId") Long userGroupId, @PathVariable("memoryId") Long memoryId){

    Memory memory =  memoryService.getMemoryInUserGroup(userGroupId, memoryId);

    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_TYPE, memory.getFileType() + ";")
      .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + memory.getName() + "\"")
      .body(memory.getData());

  }

  @GetMapping("/api/memories/{userGroupId}/{memoryId}/type")
  public ResponseEntity<HashMap<String, String>> getMemoryMimeTypeInUserGroup(@PathVariable("userGroupId") Long userGroupId, @PathVariable("memoryId") Long memoryId){

    String memoryFileType =  memoryService.getMemoryMimeTypeInUserGroup(userGroupId, memoryId);
    HashMap<String, String> jsonRes = new HashMap<>();
    jsonRes.put("memoryFileType", memoryFileType);
    return ResponseEntity.ok()
      .body(jsonRes);

  }


  @GetMapping("/api/memories/userfile/{memoryId}")
  public ResponseEntity<byte[]> getUserMemoryFile(@PathVariable("memoryId") Long memoryId){

    Memory memory =  memoryService.getMemory(memoryId);

    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_TYPE, memory.getFileType() + ";")
      .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + memory.getName() + "\"")
      .body(memory.getData());

  }

  @GetMapping("/api/memories/{memoryId}/type")
  public ResponseEntity<HashMap<String, String>> getUserMemoryMimeType(@PathVariable("memoryId") Long memoryId){

    String memoryFileType =  memoryService.getUserMemoryMimeType(memoryId);
    HashMap<String, String> jsonRes = new HashMap<>();
    jsonRes.put("memoryFileType", memoryFileType);
    return ResponseEntity.ok()
      .body(jsonRes);

  }


//  api/memories/creatememory

    @PostMapping("/api/memories/creatememory")
    public ResponseEntity<HashMap> createMemory(@RequestParam("userFile") MultipartFile file, @RequestParam("memoryName") String memoryName) {

      String message = "";
      try {
        Memory memory = memoryService.createMemory(memoryName, file);
        message = "Uploaded the file successfully: " + file.getOriginalFilename();
        HashMap jsonRes = new HashMap<>();
        jsonRes.put("message", message);
        jsonRes.put("memoryId", memory.getId());

//        JSONObject newBody = new JSONObject();
//        newBody.put("message", message);
//        newBody.put("memoryId", memory.getId());
        return ResponseEntity.status(HttpStatus.OK).body(jsonRes);
      } catch (Exception e) {
        message = "Could not upload the file: " + file.getOriginalFilename() + "!";
//        JSONObject newBody = new JSONObject();
//        newBody.put("message", message);
        HashMap jsonRes = new HashMap<>();
        jsonRes.put("message", message);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(jsonRes);
      }




    }

    @PostMapping("/api/memories/addtousergroup")
//    public ResponseEntity<ResponseMessage> addMemoryToUserGroup(@RequestParam("memoryId") String memoryId, @RequestParam("usergroupId") String usergroupId) {
    public ResponseEntity<ResponseMessage> addMemoryToUserGroup(@RequestBody() AddToUserGroupRequest addToUserGroupRequest) {
//      System.out.print("@@@@@@@@???????????????????????????? WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT? ");
//      System.out.print("@@@@@@@@???????????????????????????? WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT? ");
//      System.out.print("@@@@@@@@???????????????????????????? WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT?  WAT? WAT? WAT? WAT? ");
//      System.out.print(addToUserGroupRequest2);
      String message = "";
//      AddToUserGroupRequest addToUserGroupRequest = (AddToUserGroupRequest) addToUserGroupRequest2;
      Long memoryId = addToUserGroupRequest.getMemoryId();
      Long usergroupId = addToUserGroupRequest.getUsergroupId();
      boolean refreshDirTreeSJON = addToUserGroupRequest.getRefreshDirTreeJSON();
      System.out.println("HERE 1111111111111111111111111111111111111111111111111111111111111");
      System.out.println(refreshDirTreeSJON);
      System.out.println(addToUserGroupRequest);
      try {
        String usergroupName = memoryService.addMemoryToUserGroup(memoryId, usergroupId);
        if (refreshDirTreeSJON){
          userGroupService.saveDirTree(usergroupId);
        }

        message = "successfully added memory to usergroup: " + usergroupName;
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
      } catch (Exception e) {
        message = "could not add memory to usergroup";
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
      }




    }


  @PutMapping("/api/memories/renamememory")
//  public ResponseEntity<ResponseMessage> renameMemory(@RequestParam("memoryId") Long memoryId, @RequestParam("newName") String newName){
  public ResponseEntity<ResponseMessage> renameMemory(@RequestBody() RenameMemoryRequest renameMemoryRequest){
    try {
      Long memoryId = renameMemoryRequest.getMemoryId();
      String newName = renameMemoryRequest.getNewName();
      if (newName.length()<3 || newName.length()>40){
        throw new RuntimeException("new name string length is too small or too big");
      }
      memoryService.renameMemory(memoryId, newName);
      String message = "successfully renamed memory";
      return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
    } catch (Exception e){
      System.out.println(e);
      String message = "could not remove memory from usergroup" + e;
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
    }
  }

  @DeleteMapping("api/memories/deletememory/{memoryId}")
  public ResponseEntity<ResponseMessage> deleteMemory(@PathVariable("memoryId") Long memoryId){
    try {
      memoryService.deleteMemory(memoryId);
      String message = "successfully renamed memory";
      return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
    } catch (Exception e){
      String message = "could not remove memory from usergroup" + e;
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
    }
  }

  @PostMapping("/api/memories/removefromusergroup")
  public ResponseEntity<ResponseMessage> removeMemoryFromUserGroup(@RequestBody() AddToUserGroupRequest addToUserGroupRequest) {
    String message = "";

    Long memoryId = addToUserGroupRequest.getMemoryId();
    Long usergroupId = addToUserGroupRequest.getUsergroupId();
    boolean refreshDirTreeSJON = addToUserGroupRequest.getRefreshDirTreeJSON();

    try {
      memoryService.removeMemoryFromUserGroup(memoryId, usergroupId);
      if (refreshDirTreeSJON){
        userGroupService.saveDirTree(usergroupId);
      }

      message = "successfully removed memory from usergroup";
      return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
    } catch (Exception e) {
      message = "could not remove memory from usergroup" + e;
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
    }




  }

    @GetMapping("/api/memories/all")
    public List<MemoryItem> getUserMemories(Authentication authentication){
      UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
      Optional<User> optionalUser = userRepository.findById(userDetails.getId());

      if (optionalUser.isPresent()) {
        User userInstance = optionalUser.get();
        return memoryService.getUserMemoryItems(userInstance);
      } else {
        return Collections.emptyList();
      }
    }



  @GetMapping("/api/memories/curruser/usergroup/{usergroupId}")
  public List<MemoryItem> getUserMemoriesInUserGroup(@PathVariable("usergroupId") Long userGroupId){

    return memoryService.getUserMemoriesInUserGroup(userGroupId);

  }

  @GetMapping("/api/memories/admin/usergroup/{usergroupId}")
  public List<MemoryItem> adminGetUserMemoriesInUserGroup(@PathVariable("usergroupId") Long userGroupId){

    return memoryService.adminGetUserMemoriesInUserGroup(userGroupId);

  }



}
