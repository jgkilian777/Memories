package com.jgkilian777.memories.userGroup;


import com.jgkilian777.memories.security.MessageResponse;
import com.jgkilian777.memories.user.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RestController
@RequestMapping("/api/usergroups")
public class UserGroupController {

  @Autowired
  UserGroupServiceImpl userGroupService;

  @Autowired
  UserRepository userRepository;

  @Autowired
  UserGroupRepository userGroupRepository;


  @GetMapping()
  public List<UserGroupMinView> getUserGroups(Authentication authentication){
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    Optional<User> optionalUser = userRepository.findById(userDetails.getId());
    if (optionalUser.isPresent()) {
      User userInstance = optionalUser.get();
      return userGroupService.getUserGroupsMinView(userInstance);
    } else {
      throw new RuntimeException("principal user doesnt exist somehow");
    }
  }

  @GetMapping("/pending")
  public List<UserGroupMinView> getPendingUserGroups(Authentication authentication){
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    Optional<User> optionalUser = userRepository.findById(userDetails.getId());
    if (optionalUser.isPresent()) {
      User userInstance = optionalUser.get();
      return userGroupService.getPendingUserGroupsMinView(userInstance);
    } else {
      throw new RuntimeException("principal user doesnt exist somehow");
    }
  }

  @GetMapping("/{id}")
  public UserGroupJSONView getUserGroupJSONView(@PathVariable("id") Long id){
    return userGroupService.getUserGroupJSONView(id);
  }

  @PostMapping("/inviteuser")
  public ResponseEntity<?> inviteUserToUserGroup(@Valid @RequestBody InviteUserToUserGroupRequest inviteUserToUserGroupRequest){
    return userGroupService.inviteUserToUserGroup(inviteUserToUserGroupRequest);
  }

  @PostMapping("/removeinviteuser")
  public ResponseEntity<?> removeInviteUserToUserGroup(@Valid @RequestBody InviteUserToUserGroupRequest inviteUserToUserGroupRequest){
    return userGroupService.removeInviteUserToUserGroup(inviteUserToUserGroupRequest);
  }

  @PostMapping("/removeuser")
  public ResponseEntity<?> removeUserFromUserGroup(@Valid @RequestBody InviteUserToUserGroupRequest inviteUserToUserGroupRequest){
    return userGroupService.removeUserFromUserGroup(inviteUserToUserGroupRequest);
  }

  @PostMapping("/acceptusergroupinvite")
  public ResponseEntity<?> acceptUserGroupInvite(@RequestBody Long usergroupId){
    return userGroupService.userAcceptUserGroupInvite(usergroupId);
  }

  @PostMapping("/declineusergroupinvite")
  public ResponseEntity<?> declineUserGroupInvite(@RequestBody Long usergroupId){
    return userGroupService.userDeclineUserGroupInvite(usergroupId);
  }

  @GetMapping("/{id}/users")
  public Set<UserInUserGroupView> getUsersInUserGroupView(@PathVariable("id") Long id){
    return userGroupService.getUsersInUserGroupView(id);
  }

  @GetMapping("/{id}/pendingusers")
  public Set<PendingUserInUserGroupView> getPendingUsersInUserGroupView(@PathVariable("id") Long id){
    return userGroupService.getPendingUsersInUserGroupView(id);
  }

  @PostMapping("/createusergroup")
  public ResponseEntity<?> createUserGroup(@Valid @RequestBody CreateUserGroupRequest createUserGroupRequest) {

    Optional<User> optionalUser = userRepository.findByUsername(createUserGroupRequest.getAdminUsername());
    String emptyDirTreeJSON = "{\"dirTree\": []}";

    if (optionalUser.isPresent()){
      User userGroupAdmin = optionalUser.get();
      UserGroup newUserGroup = new UserGroup(
        userGroupAdmin,
        emptyDirTreeJSON,
        createUserGroupRequest.getUsergroupName()
      );
      newUserGroup.addUser(userGroupAdmin);
      userGroupRepository.save(newUserGroup);
      return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    } else {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: usergroup admin user error!"));
    }
  }

  @DeleteMapping("/delete/{userGroupId}")
  public ResponseEntity<?> deleteUserGroup(@PathVariable("userGroupId") Long userGroupId){
    try {
      userGroupService.deleteUserGroup(userGroupId);
      String message = "deleted usergroup successfully";
      HashMap jsonRes = new HashMap<>();
      jsonRes.put("message", message);

      return ResponseEntity.status(HttpStatus.OK).body(jsonRes);
    } catch (Exception e) {
      String message = "Could not delete the usergroup!";
      HashMap jsonRes = new HashMap<>();
      jsonRes.put("message", message);
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(jsonRes);
    }
  }

  @PutMapping("/rename/{userGroupId}")
  public ResponseEntity<?> renameUserGroup(@PathVariable("userGroupId") Long userGroupId, @RequestBody() Map<String, String> newNameMap){
    try {
      String newName = newNameMap.get("newName");
      userGroupService.renameUserGroup(userGroupId, newName);
      String message = "renamed usergroup successfully";
      HashMap jsonRes = new HashMap<>();
      jsonRes.put("message", message);

      return ResponseEntity.status(HttpStatus.OK).body(jsonRes);
    } catch (Exception e) {
      String message = "Could not rename the usergroup!";
      HashMap jsonRes = new HashMap<>();
      jsonRes.put("message", message);
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(jsonRes);
    }
  }

  @PostMapping("/savedirstructure/{usergroupId}")
  public ResponseEntity<?> saveDirStructure(@PathVariable("usergroupId") Long usergroupId, @RequestBody String dirTreeJSONs){
    JSONObject dirTreeJSONResponse = new JSONObject(dirTreeJSONs);
    JSONObject dirTreeJSON = (JSONObject) dirTreeJSONResponse.get("dirTreeJSON");
    boolean succeeded = userGroupService.saveDirTree(usergroupId, dirTreeJSON);
    if (succeeded){
      return ResponseEntity.ok(dirTreeJSON);
    } else {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: could not save directory structure..."));
    }
  }
}


