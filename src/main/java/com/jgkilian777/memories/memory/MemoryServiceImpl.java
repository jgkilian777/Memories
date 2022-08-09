package com.jgkilian777.memories.memory;

import com.jgkilian777.memories.security.AuthUtils;
import com.jgkilian777.memories.security.AuthenticationFacadeImpl;
import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.user.UserRepository;
import com.jgkilian777.memories.user.UserServiceImpl;
import com.jgkilian777.memories.userGroup.UserAndUserGroup;
import com.jgkilian777.memories.userGroup.UserGroup;
import com.jgkilian777.memories.userGroup.UserGroupRepository;
import com.jgkilian777.memories.userGroup.UserGroupServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class MemoryServiceImpl implements MemoryService {

    @Autowired
    MemoryRepository memoryRepository;

  @Autowired
  UserServiceImpl userServiceImpl;

    @Autowired
    private AuthUtils authUtils;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private ValidMimeTypes validMimeTypes;

  @Autowired
  UserGroupServiceImpl userGroupService;


    @Override
    public Memory createMemory(String name, MultipartFile file) throws IOException, RuntimeException {
      if (!validMimeTypes.getValidMimeTypes().contains(file.getContentType())){
        throw new RuntimeException("invalid file type!");
      }
      try {
        User userInstance = authUtils.getCurrentlyAuthenticatedUser();
        Memory memory = new Memory(userInstance, name, file.getContentType(), file.getBytes());
        return memoryRepository.save(memory);
      } catch (RuntimeException e){
        throw e;
      }
    }

    @Override
    public Memory getMemoryInUserGroup(Long userGroupId, Long memoryId){
      UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
      if(userAndUserGroup==null){
        throw new RuntimeException("somehow unauthorised");
      }
      Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
      if (!optionalMemory.isPresent()){
        throw new RuntimeException("memory doesnt exist");
      }
      Set<Memory> userGroupMemories= userAndUserGroup.userGroup.getMemories();
      if (!userGroupMemories.contains(optionalMemory.get())){
        throw new RuntimeException("memory isnt in usergroup!");
      } else {
        return optionalMemory.get();
      }
    }

  @Override
  public String getMemoryMimeTypeInUserGroup(Long userGroupId, Long memoryId){
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
    if (!optionalMemory.isPresent()){
      throw new RuntimeException("memory doesnt exist");
    }
    Set<Memory> userGroupMemories= userAndUserGroup.userGroup.getMemories();
    if (!userGroupMemories.contains(optionalMemory.get())){
      throw new RuntimeException("memory isnt in usergroup!");
    } else {
      return optionalMemory.get().getFileType();
    }

  }

  @Override
  public List<MemoryItem> getUserMemoriesInUserGroup(Long userGroupId) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    Set<Memory> userMemories = userAndUserGroup.user.getMemories();
    Set<Memory> userGroupMemories = userAndUserGroup.userGroup.getMemories();
    List<MemoryItem> memoryItems = new ArrayList<>();

    for (Memory userMemory : userMemories){
      if (userGroupMemories.contains(userMemory)){
        Optional<MemoryItem> memoryItem = memoryRepository.findMemoryItemById(userMemory.getId());
        if (!memoryItem.isPresent()){
          throw new RuntimeException("user memory exists in usergroup but somehow not in memory database");
        }
        memoryItems.add(memoryItem.get());
      }
    }
    return memoryItems;
  }


  @Override
  public List<MemoryItem> adminGetUserMemoriesInUserGroup(Long userGroupId) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null || userAndUserGroup.userGroup.getAdmin() != userAndUserGroup.user){
      throw new RuntimeException("somehow unauthorised");
    }
    Set<Memory> userGroupMemories = userAndUserGroup.userGroup.getMemories();
    List<MemoryItem> memoryItems = new ArrayList<>();
    for (Memory userGroupMemory : userGroupMemories){
      Optional<MemoryItem> memoryItem = memoryRepository.findMemoryItemById(userGroupMemory.getId());
      if (!memoryItem.isPresent()){
        throw new RuntimeException("user memory exists in usergroup but somehow not in memory database");
      }
      memoryItems.add(memoryItem.get());
    }
    return memoryItems;
  }

  @Override
  public void removeMemoryFromUserGroup(Long memoryId, Long userGroupId) {
    UserAndUserGroup userAndUserGroup = userServiceImpl.principalCanAccessUserGroupId(userGroupId);
    if(userAndUserGroup==null){
      throw new RuntimeException("somehow unauthorised");
    }
    Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
    if (!optionalMemory.isPresent()){
      throw new RuntimeException("memory somehow doesnt exist");
    }

    if (!userAndUserGroup.user.getMemories().contains(optionalMemory.get()) && userAndUserGroup.user!=userAndUserGroup.userGroup.getAdmin()){
      throw new RuntimeException("need to own memory or be usergroup admin to remove memory from usergroup!");
    }
    userAndUserGroup.userGroup.removeMemory(optionalMemory.get());
    userGroupRepository.save(userAndUserGroup.userGroup);
  }

  @Override
  public void renameMemory(Long memoryId, String newName) {
    User userInstance = authUtils.getCurrentlyAuthenticatedUser();
    Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
    if (!optionalMemory.isPresent()){
      throw new RuntimeException("somehow memory doesnt exist");
    }

    Memory memoryInstance = optionalMemory.get();

    if (!userInstance.getMemories().contains(memoryInstance)){
      throw new RuntimeException("user doesnt own this memory");
    }
    memoryInstance.setName(newName);
    memoryRepository.save(memoryInstance);
  }

  @Override
  public void deleteMemory(Long memoryId) {
    User userInstance = authUtils.getCurrentlyAuthenticatedUser();
    Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
    if (!optionalMemory.isPresent()){
      throw new RuntimeException("somehow memory doesnt exist");
    }

    Memory memoryInstance = optionalMemory.get();
    if (!userInstance.getMemories().contains(memoryInstance)){
      throw new RuntimeException("user doesnt own this memory");
    }
    Set<UserGroup> memoryInstanceUserGroups = memoryInstance.getUserGroups();
    for (UserGroup userGroup : memoryInstanceUserGroups){
      userGroup.removeMemory(memoryInstance);
      userGroupService.saveDirTree(userGroup.getId());
    }
    memoryRepository.delete(memoryInstance);
  }

  @Override
    public String addMemoryToUserGroup(Long memoryId, Long usergroupId) throws RuntimeException {
      try {
        User userInstance = authUtils.getCurrentlyAuthenticatedUser();
        Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
        Optional<UserGroup> optionalUserGroup = userGroupRepository.findById(usergroupId);
        if (!optionalMemory.isPresent() || !optionalUserGroup.isPresent()){
          throw new RuntimeException("somehow memory or usergroup doesnt exist");
        }
        Memory memoryInstance = optionalMemory.get();
        UserGroup usergroupInstance = optionalUserGroup.get();
        if (!userInstance.getMemories().contains(memoryInstance)){
          throw new RuntimeException("user doesnt own this memory");
        }
        if (!userInstance.getUserGroups().contains(usergroupInstance)){
          throw new RuntimeException("user doesnt have access to this usergroup");
        }
        usergroupInstance.addMemory(memoryInstance);
        userGroupRepository.save(usergroupInstance);
        return usergroupInstance.getName();
      } catch (RuntimeException e){
        throw e;
      }
    }

    @Override
    public List<MemoryItem> getUserMemoryItems(User user) {
        return memoryRepository.findMemoryItemsByUser(user);
    }

    @Override
    public Memory getMemory(Long memoryId) {
      User userInstance = authUtils.getCurrentlyAuthenticatedUser();
      Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
      if (!optionalMemory.isPresent()){
        throw new RuntimeException("somehow memory doesnt exist");
      }
      Memory memoryInstance = optionalMemory.get();
      if (!userInstance.getMemories().contains(memoryInstance)){
        throw new RuntimeException("user doesnt own this memory");
      }
      return memoryInstance;
    }

  @Override
  public String getUserMemoryMimeType(Long memoryId){
    User userInstance = authUtils.getCurrentlyAuthenticatedUser();
    Optional<Memory> optionalMemory = memoryRepository.findById(memoryId);
    if (!optionalMemory.isPresent()){
      throw new RuntimeException("somehow memory doesnt exist");
    }
    Memory memoryInstance = optionalMemory.get();
    if (!userInstance.getMemories().contains(memoryInstance)){
      throw new RuntimeException("user doesnt own this memory");
    }
    return optionalMemory.get().getFileType();
  }
}
