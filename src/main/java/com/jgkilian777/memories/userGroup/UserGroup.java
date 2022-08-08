package com.jgkilian777.memories.userGroup;

import com.jgkilian777.memories.memory.Memory;
import com.jgkilian777.memories.user.User;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class UserGroup {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false)
    private User admin;

    @Column(length = 15000)
    private String directoryTreeJSON;

    private String name;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
      name = "usergroup_users",
      joinColumns = @JoinColumn(name = "usergroup_id"),
      inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
      name = "usergroup_memories",
      joinColumns = @JoinColumn(name = "usergroup_id"),
      inverseJoinColumns = @JoinColumn(name = "memory_id"))
    private Set<Memory> memories = new HashSet<>();


  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
  @JoinTable(
    name = "usergroup_pendingusers",
    joinColumns = @JoinColumn(name = "usergroup_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
  private Set<User> pendingusers = new HashSet<>();


  public UserGroup() {
  }

  public UserGroup(User admin, String directoryTreeJSON, String name) {
    this.admin = admin;
    this.directoryTreeJSON = directoryTreeJSON;
    this.name = name;
  }


  public void addUser(User user) {
    users.add(user);
    user.getUserGroups().add(this);
  }

  public void removeUser(User user) {
    memories.removeAll(user.getMemories());
    users.remove(user);
    user.getUserGroups().remove(this);
  }

  public User getAdmin(){
    return this.admin;
  }

  public void addPendingUser(User user) {
    pendingusers.add(user);
    user.getPendingUserGroups().add(this);
  }

  public void removePendingUser(User user) {
    pendingusers.remove(user);
    user.getPendingUserGroups().remove(this);
  }

  public Set<User> getPendingusers(){
    return this.pendingusers;
  }

  public void addMemory(Memory memory) {
    memories.add(memory);
    memory.getUserGroups().add(this);
  }

  public Set<User> getUsers(){
    return this.users;
  }

  public void removeMemory(Memory memory) {
    memories.remove(memory);
    memory.getUserGroups().remove(this);
  }

  public Set<Memory> getMemories(){
    return this.memories;
  }

  public void setDirectoryTreeJSON(String dirTreeJSONString){
    this.directoryTreeJSON = dirTreeJSONString;
  }
  public String getDirectoryTreeJSON(){
    return this.directoryTreeJSON;
  }

  public String getName(){
    return this.name;
  }

  public Long getId(){
    return this.id;
  }
  public void setName(String newName){
    this.name=newName;
  }

}
