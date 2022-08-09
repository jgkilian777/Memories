package com.jgkilian777.memories.userGroup;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateUserGroupRequest {

  @NotBlank
  @Size(min = 3, max = 20)
  private String adminUsername;

  @NotBlank
  @Size(min = 3, max = 40)
  private String usergroupName;

  public String getAdminUsername() {
    return adminUsername;
  }

  public void setAdminUsername(String adminUsername) {
    this.adminUsername = adminUsername;
  }

  public String getUsergroupName() {
    return usergroupName;
  }

  public void setUsergroupName(String usergroupName) {
    this.usergroupName = usergroupName;
  }

}
