package com.jgkilian777.memories.userGroup;

import com.jgkilian777.memories.user.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserGroupRepository extends CrudRepository<UserGroup, Long> {
  List<UserGroupMinView> findUserGroupsByUsers(User user);
  List<UserGroupMinView> findPendinguserGroupsByPendingusers(User user);

  Optional<UserGroupJSONView> findJSONViewById(Long id);
  Optional<UserGroup> findUserGroupById(Long id);
  String getDirectoryTreeJSONById(Long id);



}
