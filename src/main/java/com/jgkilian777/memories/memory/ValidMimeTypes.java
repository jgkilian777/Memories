package com.jgkilian777.memories.memory;

import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class ValidMimeTypes {
  private HashSet<String> validMimeTypes;

  public ValidMimeTypes(){
    this.validMimeTypes = new HashSet<>();
    this.validMimeTypes.add("video/mp4");
    this.validMimeTypes.add("video/webm");
    this.validMimeTypes.add("image/gif");
    this.validMimeTypes.add("image/jpeg");
    this.validMimeTypes.add("image/png");
  }

  public HashSet<String> getValidMimeTypes() {
    return this.validMimeTypes;
  }
}
