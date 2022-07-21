package com.jgkilian777.memories.memory;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class MemoryShared {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
}
