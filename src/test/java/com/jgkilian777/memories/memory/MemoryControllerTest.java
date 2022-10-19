package com.jgkilian777.memories.memory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jgkilian777.memories.ResponseMessage;

import com.jgkilian777.memories.security.JwtUtils;
import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.user.UserDetailsServiceImpl;
import com.jgkilian777.memories.user.UserRepository;
import com.jgkilian777.memories.userGroup.UserGroupServiceImpl;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MemoryController.class)

public class MemoryControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private MemoryServiceImpl memoryService;

  @MockBean
  private UserRepository userRepository;

  @MockBean
  private UserGroupServiceImpl userGroupService;

  @MockBean
  JwtUtils jwtUtils;

  @MockBean
  UserDetailsServiceImpl userDetailsService;

  @WithMockUser
  @Test
  public void it_should_return_memory_data_and_headers() throws Exception {
    User user = new User();
    Long userGroupId = 0L;
    Long memoryId = 0L;
    String name = "testMemory";
    String filetype = "image/png";
    byte[] data = new byte[0];
    Memory memory = new Memory(user, name, filetype, data);

    when(this.memoryService.getMemoryInUserGroup(userGroupId, memoryId)).thenReturn(memory);
    this.mockMvc.perform(get("/api/memories/" + userGroupId.toString() + "/"+memoryId.toString()))
      .andExpect(status().isOk())
      .andExpect(content().contentType(filetype))
      .andExpect(header().string("Content-Disposition", "inline; filename=\"" + name + "\""))
      .andExpect(content().bytes(data));
  }

  @WithMockUser
  @Test
  public void it_should_return_memory_mime_type() throws Exception {
    Long userGroupId = 0L;
    Long memoryId = 0L;

    String filetype = "image/png";
    String expectedJson = "{\"memoryFileType\": \"" + filetype + "\"}";

    when(this.memoryService.getMemoryMimeTypeInUserGroup(userGroupId, memoryId)).thenReturn(filetype);
    this.mockMvc.perform(get("/api/memories/" + userGroupId.toString() + "/" + memoryId.toString() + "/type"))
      .andExpect(status().isOk())
      .andExpect(content().json(expectedJson));
  }


  @WithMockUser
  @Test
  public void it_should_return_user_memory_data_and_headers() throws Exception {
    User user = new User();
    Long memoryId = 0L;
    String name = "testMemory";
    String filetype = "image/png";
    byte[] data = new byte[0];
    Memory memory = new Memory(user, name, filetype, data);

    when(this.memoryService.getMemory(memoryId)).thenReturn(memory);
    this.mockMvc.perform(get("/api/memories/userfile/"+memoryId.toString()))
      .andExpect(status().isOk())
      .andExpect(content().contentType(filetype))
      .andExpect(header().string("Content-Disposition", "inline; filename=\"" + name + "\""))
      .andExpect(content().bytes(data));
  }


  @WithMockUser
  @Test
  public void it_should_return_user_memory_mime_type() throws Exception {
    Long memoryId = 0L;
    String filetype = "image/png";
    String expectedJson = "{\"memoryFileType\": \"" + filetype + "\"}";

    when(this.memoryService.getUserMemoryMimeType(memoryId)).thenReturn(filetype);
    this.mockMvc.perform(get("/api/memories/" + memoryId.toString() + "/type"))
      .andExpect(status().isOk())
      .andExpect(content().json(expectedJson));
  }


  @WithMockUser
  @Test
  public void create_memory_should_return_memoryId_and_confirmation_message() throws Exception {
    String originalFilename = "my_test_image";
    byte[] data = new byte[0];
    String filetype = "image/png";
    Memory testMemory = new Memory();
    Memory spyTestMemory = spy(testMemory);
    MockMultipartFile userFile = new MockMultipartFile("userFile", originalFilename, filetype, data);
    String memoryName = "testMemory";

    JSONObject expectedJsonObj = new JSONObject();
    expectedJsonObj.put("message", "Uploaded the file successfully: " + userFile.getOriginalFilename());
    expectedJsonObj.put("memoryId", 1);

    String expectedJson = expectedJsonObj.toString();

    when(this.memoryService.createMemory(memoryName, userFile)).thenReturn(spyTestMemory);
    when(spyTestMemory.getId()).thenReturn(1L);
    this.mockMvc.perform(MockMvcRequestBuilders.multipart("/api/memories/creatememory")
        .file(userFile)
        .param("memoryName", memoryName).with(csrf()))
      .andExpect(status().isOk())
      .andExpect(content().json(expectedJson));
  }


  @WithMockUser
  @Test
  public void rename_memory_should_fail_if_name_is_too_small() throws Exception {
    RenameMemoryRequest renameMemoryRequest = new RenameMemoryRequest();
    renameMemoryRequest.setMemoryId(0L);
    renameMemoryRequest.setNewName("a");

    ResponseMessage responseMessage = new ResponseMessage("could not remove memory from usergroup" + new RuntimeException("new name string length is too small or too big"));

    this.mockMvc.perform(put("/api/memories/renamememory").with(csrf())
      .content(objectMapper.writeValueAsString(renameMemoryRequest))
      .contentType(MediaType.APPLICATION_JSON)
    )
      .andExpect(status().isExpectationFailed())
      .andExpect(content().string(objectMapper.writeValueAsString(responseMessage)));
  }

  @WithMockUser
  @Test
  public void rename_memory_should_succeed_if_name_is_suitable_length() throws Exception {
    RenameMemoryRequest renameMemoryRequest = new RenameMemoryRequest();
    renameMemoryRequest.setMemoryId(0L);
    renameMemoryRequest.setNewName("newMemoryName");

    ResponseMessage responseMessage = new ResponseMessage("successfully renamed memory");

    this.mockMvc.perform(put("/api/memories/renamememory").with(csrf())
        .content(objectMapper.writeValueAsString(renameMemoryRequest))
        .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andExpect(content().string(objectMapper.writeValueAsString(responseMessage)));
  }

}
