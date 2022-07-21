package com.jgkilian777.memories.userGroup;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class UserGroupUsers {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
}
