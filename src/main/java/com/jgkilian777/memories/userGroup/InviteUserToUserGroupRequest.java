package com.jgkilian777.memories.userGroup;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class InviteUserToUserGroupRequest {

  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotNull
  private Long usergroupId;

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public Long getUsergroupId() {
    return this.usergroupId;
  }

  public void setUsergroupId(Long usergroupId) {
    this.usergroupId = usergroupId;
  }
}
