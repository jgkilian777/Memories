package com.jgkilian777.memories.memory;

import com.jgkilian777.memories.user.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;

public interface MemoryService {
    public abstract Memory createMemory(String name, MultipartFile file) throws IOException;

    public abstract Memory getMemory(Long memoryId);
    public abstract Memory getMemoryInUserGroup(Long userGroupId, Long memoryId);
    public abstract String addMemoryToUserGroup(Long memoryId, Long usergroupId);
    public abstract Collection<MemoryItem> getUserMemoryItems(User user);

  public abstract String getMemoryMimeTypeInUserGroup(Long userGroupId, Long memoryId);
  public abstract Collection<MemoryItem> getUserMemoriesInUserGroup(Long userGroupId);
  public abstract Collection<MemoryItem> adminGetUserMemoriesInUserGroup(Long userGroupId);
  public abstract void removeMemoryFromUserGroup(Long memoryId, Long usergroupId);
  public abstract void renameMemory(Long memoryId, String newName);
  public abstract void deleteMemory(Long memoryId);
  public abstract String getUserMemoryMimeType(Long memoryId);


}
