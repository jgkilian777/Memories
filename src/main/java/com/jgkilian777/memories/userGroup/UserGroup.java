package com.jgkilian777.memories.userGroup;

import com.jgkilian777.memories.user.User;

import javax.persistence.*;
import java.util.Set;

@Entity
public class UserGroup {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;

    @ManyToOne(optional = false)
    private User admin;

    private String directoryTreeJSON;

    private String name;

    @ManyToMany
    @JoinTable(
      name = "usergroup_users",
      joinColumns = @JoinColumn(name = "usergroup_id"),
      inverseJoinColumns = @JoinColumn(name = "user_id"))
    Set<User> users;



}
