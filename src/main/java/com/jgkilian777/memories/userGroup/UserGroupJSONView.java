package com.jgkilian777.memories.userGroup;

public class UserGroupJSONView {
  private Long id;
  private String name;
  private String directoryTreeJSON;
//  Integer getId();
//  String getName();
//  String getDirectoryTreeJSON();
  private String adminUsername;

  public UserGroupJSONView(Long id, String name, String directoryTreeJSON){
    this.id = id;
    this.name=name;
    this.directoryTreeJSON=directoryTreeJSON;
  }

  public Long getId(){
    return this.id;
  }

  public String getName(){
    return this.name;
  }

  public String getDirectoryTreeJSON(){
    return this.directoryTreeJSON;
  }


  public void setId(Long id){
    this.id=id;
  }

  public void setName(String name){
    this.name=name;
  }

  public void setDirectoryTreeJSON(String directoryTreeJSON){
    this.directoryTreeJSON=directoryTreeJSON;
  }

  public void setAdminUsername(String adminUsername){
    this.adminUsername=adminUsername;
  }

  public String getAdminUsername(){
    return this.adminUsername;
  }

}
