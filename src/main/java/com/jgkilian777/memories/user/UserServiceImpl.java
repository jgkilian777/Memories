package com.jgkilian777.memories.user;

import com.jgkilian777.memories.security.AuthenticationFacadeImpl;
import com.jgkilian777.memories.userGroup.UserAndUserGroup;
import com.jgkilian777.memories.userGroup.UserGroup;
import com.jgkilian777.memories.userGroup.UserGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

  @Autowired
  UserRepository userRepository;

  @Autowired
  UserGroupRepository userGroupRepository;

  @Autowired
  private AuthenticationFacadeImpl authenticationFacadeImpl;

  @Override
  public UserAndUserGroup principalCanAccessUserGroupId(Long usergroupId) {
    User userInstance = principalUserExists();
    UserGroup userGroupInstance = userGroupExists(usergroupId);
    if(userInstance.getUserGroups().contains(userGroupInstance)){
      return new UserAndUserGroup(userInstance, userGroupInstance);
    } else{
      return null;
    }
  }

  @Override
  public boolean userIsAdminOfGroup(UserAndUserGroup userAndUserGroup){
    if (userAndUserGroup.userGroup.getAdmin() == userAndUserGroup.user){
      return true;
    } else{
      return false;
    }
  }

  @Override
  public User principalUserExists(){
    Authentication authentication = authenticationFacadeImpl.getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    Optional<User> optionalUser = userRepository.findById(userDetails.getId());
    if (!optionalUser.isPresent()){
      throw new RuntimeException("somehow principal user doesnt exist");
    }
    return optionalUser.get();
  }

  @Override
  public UserGroup userGroupExists(Long usergroupId){
    Optional<UserGroup> optionalUserGroup = userGroupRepository.findUserGroupById(usergroupId);
    if (!optionalUserGroup.isPresent()){
      throw new RuntimeException("somehow usergroup doesnt exist");
    }
    return optionalUserGroup.get();
  }

}
