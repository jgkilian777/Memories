package com.jgkilian777.memories.userGroup;

import com.jgkilian777.memories.user.User;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;


import java.util.List;
import java.util.Set;

public interface UserGroupService {
  public abstract List<UserGroupMinView> getUserGroupsMinView(User user);
  public abstract List<UserGroupMinView> getPendingUserGroupsMinView(User user);
  public abstract Set<UserInUserGroupView> getUsersInUserGroupView(Long userGroupId);
  public abstract Set<PendingUserInUserGroupView> getPendingUsersInUserGroupView(Long userGroupId);
  public abstract UserGroupJSONView getUserGroupJSONView(Long userGroupId);

  public abstract boolean saveDirTree(Long userGroupId, JSONObject dirTreeJSON);
  public abstract boolean saveDirTree(Long userGroupId);
//  public abstract void verifyAndUpdateDirTree(JSONObject dirTreeJSON);
  public abstract boolean verifyAndUpdateDirTree(JSONObject dirTreeJSON, UserGroup usergroup);
  public abstract boolean refreshDirTreeTransactional(Long userGroupId);
  public abstract ResponseEntity<?> inviteUserToUserGroup(InviteUserToUserGroupRequest inviteUserToUserGroupRequest);
  public abstract ResponseEntity<?> removeInviteUserToUserGroup(InviteUserToUserGroupRequest inviteUserToUserGroupRequest);
  public abstract ResponseEntity<?> removeUserFromUserGroup(InviteUserToUserGroupRequest inviteUserToUserGroupRequest);
  public abstract ResponseEntity<?> userAcceptUserGroupInvite(Long usergroupId);
  public abstract ResponseEntity<?> userDeclineUserGroupInvite(Long usergroupId);
  public abstract void renameUserGroup(Long userGroupId, String newName);
  public abstract void deleteUserGroup(Long userGroupId);
  public abstract void deleteUserGroupTransactional(UserGroup userGroup);
}
