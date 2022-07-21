package com.jgkilian777.memories.memory;

import com.jgkilian777.memories.user.User;

import javax.persistence.*;

@Entity
@Table(name = "memories")
public class Memory {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    private User user;

    public Memory() {
    }
}
