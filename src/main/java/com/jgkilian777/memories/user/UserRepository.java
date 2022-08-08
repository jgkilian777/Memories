package com.jgkilian777.memories.user;

import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.userGroup.*;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends CrudRepository<User, Long> {
//  List<UserGroupMinView> getUserGroups(User user);
  Optional<User> findByUsername(String username);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);
//  UserGroupJSONView getUserGroupById(Integer id);

  Optional<User> findById(Long id);

  Set<UserInUserGroupView> findUsersByUserGroups(UserGroup userGroup);
  Set<PendingUserInUserGroupView> findUsersByPendinguserGroups(UserGroup userGroup);
//  Set<User> findUsersByUsername(String username);
//  Boolean

}
