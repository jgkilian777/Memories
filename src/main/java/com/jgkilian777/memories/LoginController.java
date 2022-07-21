package com.jgkilian777.memories;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class LoginController {
    @GetMapping({"/login"})
    public String login() {
        return "login";
    }
}
