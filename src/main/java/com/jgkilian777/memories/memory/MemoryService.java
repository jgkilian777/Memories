package com.jgkilian777.memories.memory;

import java.util.Collection;

public interface MemoryService {
    public abstract void createMemory(Memory memory);
    public abstract void updateMemory(String id, Memory memory);
    public abstract void deleteMemory(String id);
    public abstract Collection<Memory> getUserMemories(String userId);
    public abstract Memory getMemory(String memoryId);
}
