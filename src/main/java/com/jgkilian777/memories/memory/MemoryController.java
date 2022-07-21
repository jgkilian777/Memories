package com.jgkilian777.memories.memory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MemoryController {
    
    @Autowired
    MemoryService memoryService;
    
    @GetMapping("/memories/{id}")
    public Memory getMemory(@PathVariable("id") String id){
        return memoryService.getMemory(id);
    }
}
