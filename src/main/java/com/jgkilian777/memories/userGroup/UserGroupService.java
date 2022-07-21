package com.jgkilian777.memories.userGroup;

import com.jgkilian777.memories.user.User;

import java.util.Collection;
import java.util.List;

public interface UserGroupService {
  public abstract List<UserGroup> getUserGroups(User user);
  public abstract UserGroup getUserGroup(String userGroupId);
}
