package com.jgkilian777.memories.userGroup;

import com.jgkilian777.memories.user.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserGroupRepository extends CrudRepository<UserGroup, Integer> {
  List<UserGroupMinView> findUserGroupsByUsers(User user);

  UserGroupJSONView getUserGroupById(Integer id);

}
