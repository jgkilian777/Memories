package com.jgkilian777.memories.memory;

import java.time.Instant;

public interface MemoryItem {
  Long getId();
  String getName();
  Instant getDateTimeAdded();
  String getFileType();
}
