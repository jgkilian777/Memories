package com.jgkilian777.memories.user;

import com.jgkilian777.memories.userGroup.*;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.Set;

public interface UserRepository extends CrudRepository<User, Long> {
  Optional<User> findByUsername(String username);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);

  Optional<User> findById(Long id);

  Set<UserInUserGroupView> findUsersByUserGroups(UserGroup userGroup);
  Set<PendingUserInUserGroupView> findUsersByPendinguserGroups(UserGroup userGroup);

}
