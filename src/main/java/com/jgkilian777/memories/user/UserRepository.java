package com.jgkilian777.memories.user;

import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.userGroup.UserGroup;
import com.jgkilian777.memories.userGroup.UserGroupJSONView;
import com.jgkilian777.memories.userGroup.UserGroupMinView;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {
//  List<UserGroupMinView> getUserGroups(User user);
  Optional<User> findByUsername(String username);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);
//  UserGroupJSONView getUserGroupById(Integer id);

}
