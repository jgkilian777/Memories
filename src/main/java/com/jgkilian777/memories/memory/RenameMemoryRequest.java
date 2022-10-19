package com.jgkilian777.memories.memory;

public class RenameMemoryRequest {

  private Long memoryId;
  private String newName;

  public Long getMemoryId(){
    return this.memoryId;
  }
  public String getNewName(){return this.newName;}

  public void setMemoryId(Long memoryId){this.memoryId = memoryId;}
  public void setNewName(String newName){this.newName = newName;}

}
