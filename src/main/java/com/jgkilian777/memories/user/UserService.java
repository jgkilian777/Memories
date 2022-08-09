package com.jgkilian777.memories.user;

import com.jgkilian777.memories.userGroup.UserAndUserGroup;
import com.jgkilian777.memories.userGroup.UserGroup;

public interface UserService {
  public abstract UserAndUserGroup principalCanAccessUserGroupId(Long usergroupId);
  public abstract UserGroup userGroupExists(Long usergroupId);
  public abstract User principalUserExists();
  public abstract boolean userIsAdminOfGroup(UserAndUserGroup userAndUserGroup);

}
