package com.jgkilian777.memories.memory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class MemoryServiceImpl implements MemoryService {
    
    @Autowired
    MemoryRepository memoryRepository;
    
    @Override
    public void createMemory(Memory memory) {
    
    }
    
    @Override
    public void updateMemory(String id, Memory memory) {
    
    }
    
    @Override
    public void deleteMemory(String id) {
    
    }
    
    @Override
    public Collection<Memory> getUserMemories(String userId) {
        return null;
    }
    
    @Override
    public Memory getMemory(String memoryId) {
        return null;
    }
}
