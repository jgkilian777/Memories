package com.jgkilian777.memories.memory;

import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.userGroup.UserGroup;

import javax.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "memories")
public class Memory {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    private User user;

    @ManyToMany(mappedBy = "memories", fetch = FetchType.LAZY)
    private Set<UserGroup> userGroups = new HashSet<>();

    private String name;

    private String fileType;

    private Instant dateTimeAdded;

    @Lob
    private byte[] data;

    public Memory() {
    }

    public Memory(User user, String name, String fileType, byte[] data){
      this.user = user;
      this.name = name;
      this.data = data;
      this.fileType = fileType;
      this.dateTimeAdded = Instant.now();
    }

    public Set<UserGroup> getUserGroups(){return userGroups;}
    public String getName(){
      return this.name;
    }
    public void setName(String name){
      this.name = name;
    }

    public Long getId(){
      return this.id;
    }

    public User getUser(){
      return this.user;
    }

  public byte[] getData() {
    return data;
  }

  public void setData(byte[] data) {
    this.data = data;
  }

  public String getFileType(){
      return this.fileType;
  }

}
