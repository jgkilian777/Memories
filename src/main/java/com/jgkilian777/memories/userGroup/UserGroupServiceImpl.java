package com.jgkilian777.memories.userGroup;

import com.jgkilian777.memories.handleJSON.HandleJSON;
import com.jgkilian777.memories.memory.Memory;
import com.jgkilian777.memories.memory.MemoryRepository;
import com.jgkilian777.memories.security.AuthUtils;
import com.jgkilian777.memories.security.MessageResponse;
import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.user.UserRepository;
import com.jgkilian777.memories.user.UserServiceImpl;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UserGroupServiceImpl implements UserGroupService{

  @Autowired
  UserRepository userRepository;

  @Autowired
  UserGroupRepository userGroupRepository;

  @Autowired
  UserServiceImpl userServiceImpl;

  @Autowired
  private AuthUtils authUtils;

  @Autowired
  MemoryRepository memoryRepository;

  @Override
  public List<UserGroupMinView> getUserGroupsMinView(User user) {
    return userGroupRepository.findUserGroupsByUsers(user);
  }

  @Override
  public List<UserGroupMinView> getPendingUserGroupsMinView(User user) {
    return userGroupRepository.findPendinguserGroupsByPendingusers(user);
  }

  @Override
  public Set<UserInUserGroupView> getUsersInUserGroupView(Long userGroupId) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    return userRepository.findUsersByUserGroups(userAndUserGroup.userGroup);
  }

  @Override
  public Set<PendingUserInUserGroupView> getPendingUsersInUserGroupView(Long userGroupId) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    return userRepository.findUsersByPendinguserGroups(userAndUserGroup.userGroup);
  }

  @Override
  public UserGroupJSONView getUserGroupJSONView(Long userGroupId) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    Optional<UserGroupJSONView> optionalUserGroupJSONView = userGroupRepository.findJSONViewById(userGroupId);
    if(!optionalUserGroupJSONView.isPresent()){
      throw new RuntimeException("somehow usergroup instantly disappeared");
    }
    UserGroupJSONView userGroupJSONView = optionalUserGroupJSONView.get();
    userGroupJSONView.setAdminUsername(userAndUserGroup.userGroup.getAdmin().getUsername());
    return userGroupJSONView;
  }

  @Override
  public boolean saveDirTree(Long userGroupId, JSONObject dirTreeJSON) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    if (!userServiceImpl.userIsAdminOfGroup(userAndUserGroup)){
      throw new RuntimeException("not admin");
    }
    boolean succeeded =  verifyAndUpdateDirTree(dirTreeJSON, userAndUserGroup.userGroup); // modifies dirTreeJSON
    if (succeeded){
      userAndUserGroup.userGroup.setDirectoryTreeJSON(dirTreeJSON.toString());
      userGroupRepository.save(userAndUserGroup.userGroup);
      return true;
    }
    return false;
  }


  @Override
  public boolean saveDirTree(Long userGroupId) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    boolean succeeded =  refreshDirTreeTransactional(userGroupId); // modifies dirTreeJSON
    return succeeded;
  }

  @Override
  @Transactional
  public boolean refreshDirTreeTransactional(Long userGroupId){
    Optional<UserGroup> optionalUsergroup = userGroupRepository.findUserGroupById(userGroupId);
    if (!optionalUsergroup.isPresent()){
      throw new RuntimeException("somehow usergroup doesnt exist");
    }
    UserGroup usergroup = optionalUsergroup.get();
    Set<Memory> memories = usergroup.getMemories();
    HandleJSON handleJSON = new HandleJSON(memories, memoryRepository);
    JSONObject dirTreeJSONObject = new JSONObject(usergroup.getDirectoryTreeJSON());
    boolean response = handleJSON.verifyAndCleanDirTreeJSON(dirTreeJSONObject);
    if (response){
      usergroup.setDirectoryTreeJSON(dirTreeJSONObject.toString());
      userGroupRepository.save(usergroup);
    }
    return response;
  }

  @Override
  public ResponseEntity<?> inviteUserToUserGroup(InviteUserToUserGroupRequest inviteUserToUserGroupRequest) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(inviteUserToUserGroupRequest.getUsergroupId());
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    if (!userServiceImpl.userIsAdminOfGroup(userAndUserGroup)){
      return ResponseEntity.badRequest().body(new MessageResponse("Error: you are not an admin of this group!"));
    }
    Optional<User> optionalPendingUser = userRepository.findByUsername(inviteUserToUserGroupRequest.getUsername());
    if (!optionalPendingUser.isPresent()){
      throw new RuntimeException("somehow pending user doesnt exist");
    }
    if (userAndUserGroup.userGroup.getUsers().contains(optionalPendingUser.get())){
      return ResponseEntity.badRequest().body(new MessageResponse("Error: user is already in group!"));
    }
    userAndUserGroup.userGroup.addPendingUser(optionalPendingUser.get());
    userGroupRepository.save(userAndUserGroup.userGroup);
    return ResponseEntity.ok(new MessageResponse("User invited to group successfully!"));
  }

  @Override
  public ResponseEntity<?> removeInviteUserToUserGroup(InviteUserToUserGroupRequest inviteUserToUserGroupRequest) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(inviteUserToUserGroupRequest.getUsergroupId());
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    if (!userServiceImpl.userIsAdminOfGroup(userAndUserGroup)){
      return ResponseEntity.badRequest().body(new MessageResponse("Error: you are not an admin of this group!"));
    }
    if (!userServiceImpl.userIsAdminOfGroup(userAndUserGroup)){
      return ResponseEntity.badRequest().body(new MessageResponse("Error: you are not an admin of this group!"));
    }
    Optional<User> optionalPendingUser = userRepository.findByUsername(inviteUserToUserGroupRequest.getUsername());
    if (!optionalPendingUser.isPresent()){
      throw new RuntimeException("somehow pending user doesnt exist");
    }
    userAndUserGroup.userGroup.removePendingUser(optionalPendingUser.get());
    userGroupRepository.save(userAndUserGroup.userGroup);
    return ResponseEntity.ok(new MessageResponse("User invite to group cancelled successfully!"));
  }


  @Override
  public ResponseEntity<?> removeUserFromUserGroup(InviteUserToUserGroupRequest inviteUserToUserGroupRequest) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(inviteUserToUserGroupRequest.getUsergroupId());
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    if (!userServiceImpl.userIsAdminOfGroup(userAndUserGroup)){
      return ResponseEntity.badRequest().body(new MessageResponse("Error: you are not an admin of this group!"));
    }
    Optional<User> optionalRemoveUser = userRepository.findByUsername(inviteUserToUserGroupRequest.getUsername());
    if (!optionalRemoveUser.isPresent()){
      throw new RuntimeException("somehow user doesnt exist");
    }
    User removeUser = optionalRemoveUser.get();
    if (removeUser == userAndUserGroup.userGroup.getAdmin()){
      throw new RuntimeException("attempting to remove admin from usergroup users");
    }
    userAndUserGroup.userGroup.removeUser(removeUser);
    userGroupRepository.save(userAndUserGroup.userGroup);
    this.saveDirTree(inviteUserToUserGroupRequest.getUsergroupId());
    return ResponseEntity.ok(new MessageResponse("User removed from group successfully!"));
  }

  @Override
  public ResponseEntity<?> userAcceptUserGroupInvite(Long usergroupId) {
    User user = userServiceImpl.principalUserExists();
    UserGroup userGroup = userServiceImpl.userGroupExists(usergroupId);
    Set<User> pendingUsers = userGroup.getPendingusers();
    if (pendingUsers.contains(user)){
      userGroup.removePendingUser(user);
      userGroup.addUser(user);
      userGroupRepository.save(userGroup);
      return ResponseEntity.ok(new MessageResponse("User accepted group invite successfully!"));
    } else {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: user invite for this user does not exist in this group!!"));
    }
  }

  @Override
  public ResponseEntity<?> userDeclineUserGroupInvite(Long usergroupId) {
    User user = userServiceImpl.principalUserExists();
    UserGroup userGroup = userServiceImpl.userGroupExists(usergroupId);
    userGroup.removePendingUser(user);
    userGroupRepository.save(userGroup);
    return ResponseEntity.ok(new MessageResponse("User successfully declined invite to this usergroup (if the invite existed)!"));
  }

  @Override
  public void renameUserGroup(Long userGroupId, String newName) {
    User userInstance = authUtils.getCurrentlyAuthenticatedUser();
    Optional<UserGroup> optionalUserGroup = userGroupRepository.findById(userGroupId);
    if (!optionalUserGroup.isPresent()){
      throw new RuntimeException("usergroup doesnt exist");
    }
    UserGroup userGroupInstance = optionalUserGroup.get();
    if (userGroupInstance.getAdmin()!=userInstance){
      throw new RuntimeException("user isnt admin of this group!");
    }
    userGroupInstance.setName(newName);
    userGroupRepository.save(userGroupInstance);
  }

  @Override
  public void deleteUserGroup(Long userGroupId) {
    User userInstance = authUtils.getCurrentlyAuthenticatedUser();
    Optional<UserGroup> optionalUserGroup = userGroupRepository.findById(userGroupId);
    if (!optionalUserGroup.isPresent()){
      throw new RuntimeException("usergroup doesnt exist");
    }
    UserGroup userGroupInstance = optionalUserGroup.get();
    if (userGroupInstance.getAdmin()!=userInstance){
      throw new RuntimeException("user isnt admin of this group!");
    }
    userGroupRepository.delete(userGroupInstance); // Since UserGroup is the owner in all of its relations, can simply delete without manually removing its references?
  }

  @Override
  public boolean verifyAndUpdateDirTree(JSONObject dirTreeJSON, UserGroup usergroup) { // modifies dirTreeJSON
//    prune unauthorised files
//    add authorised files to base that arent in any folders already
    Set<Memory> memories = usergroup.getMemories();
    HandleJSON handleJSON = new HandleJSON(memories, memoryRepository);
    boolean response = handleJSON.verifyAndCleanDirTreeJSON(dirTreeJSON);
    return response;
  }
}

