package com.jgkilian777.memories.memory;

public class RenameMemoryRequest {

  private Long memoryId;
  private String newName;

  public Long getMemoryId(){
    return this.memoryId;
  }
  public String getNewName(){return this.newName;}
}
