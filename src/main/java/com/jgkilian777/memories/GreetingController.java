package com.jgkilian777.memories;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GreetingController {
    @GetMapping({"/hello"})
    public String login() {
        return "hello";
    }
}