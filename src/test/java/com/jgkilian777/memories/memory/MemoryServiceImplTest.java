package com.jgkilian777.memories.memory;

import com.jgkilian777.memories.security.AuthUtils;
import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.user.UserServiceImpl;
import com.jgkilian777.memories.userGroup.UserGroup;
import com.jgkilian777.memories.userGroup.UserGroupRepository;
import com.jgkilian777.memories.userGroup.UserGroupServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MemoryServiceImplTest {

  @InjectMocks
  MemoryServiceImpl memoryService;

  @Mock
  MemoryRepository memoryRepository;

  @Mock
  UserServiceImpl userServiceImpl;

  @Mock
  AuthUtils authUtils;

  @Mock
  UserGroupRepository userGroupRepository;

  @Spy
  ValidMimeTypes validMimeTypes;

  @Mock
  UserGroupServiceImpl userGroupService;

  @Test
  public void create_memory_should_fail_if_invalid_mime_type(){
    String name = "name";
    String originalFilename = "originalFilename";
    String contentType = "apple";
    byte[] data = new byte[0];
    MockMultipartFile file = new MockMultipartFile(name, originalFilename, contentType, data);

    String memoryName = "memoryName";

    Exception exception = assertThrows(RuntimeException.class, () -> {
      this.memoryService.createMemory(memoryName, file);
    });

    String expectedMessage = "invalid file type!";
    String actualMessage = exception.getMessage();

    assertEquals(actualMessage, expectedMessage);
  }
  @Test
  public void it_should_add_memory_to_usergroup(){
    User user = new User();

    Memory memory = new Memory(user, "memoryName", "image/png", new byte[0]);
    Long memoryId = 1L;
    UserGroup userGroup = new UserGroup(user, null, "userGroupName");
    Long userGroupId = 2L;
    user.addMemory(memory);
    user.getUserGroups().add(userGroup);
    userGroup.addUser(user);
    Optional<Memory> optionalMemory = Optional.of(memory);
    Optional<UserGroup> optionalUserGroup = Optional.of(userGroup);

    when(this.authUtils.getCurrentlyAuthenticatedUser()).thenReturn(user);
    when(this.memoryRepository.findById(memoryId)).thenReturn(optionalMemory);
    when(this.userGroupRepository.findById(userGroupId)).thenReturn(optionalUserGroup);

    String usergroupNameActual = this.memoryService.addMemoryToUserGroup(memoryId, userGroupId);

    assertThat(usergroupNameActual).isEqualTo(userGroup.getName());
    assertThat(userGroup.getMemories()).contains(memory);
    verify(userGroupRepository, times(1)).save(userGroup);
  }
}
