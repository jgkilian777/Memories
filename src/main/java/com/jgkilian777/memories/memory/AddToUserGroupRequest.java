package com.jgkilian777.memories.memory;

public class AddToUserGroupRequest {
  private Long usergroupId;
  private Long memoryId;
  private boolean refreshDirTreeJSON;

  public Long getUsergroupId(){
    return this.usergroupId;
  }
  public Long getMemoryId(){
    return this.memoryId;
  }
  public boolean getRefreshDirTreeJSON(){return this.refreshDirTreeJSON;}
}
