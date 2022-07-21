package com.jgkilian777.memories.userGroup;


import com.jgkilian777.memories.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RestController
public class UserGroupController {

  @Autowired
  UserGroupService userGroupService;


  @GetMapping("/api/usergroups")
  public List<UserGroup> getUserGroups(User user){
    return userGroupService.getUserGroups(user);
  }

  @GetMapping("/api/usergroups/{id}")
  public UserGroup getMemory(@PathVariable("id") String id){
    return userGroupService.getUserGroup(id);
  }

}


