package com.jgkilian777.memories.memory;

import com.jgkilian777.memories.user.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface MemoryRepository extends CrudRepository<Memory, Long> {
  Optional<Memory> findById(Long id);

  List<MemoryItem> findMemoryItemsByUser(User user);
  Optional<MemoryItem> findMemoryItemById(Long id);
}

