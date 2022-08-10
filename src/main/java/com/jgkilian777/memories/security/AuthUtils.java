package com.jgkilian777.memories.security;

import com.jgkilian777.memories.user.User;
import com.jgkilian777.memories.user.UserDetailsImpl;
import com.jgkilian777.memories.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthUtils {

  private final AuthenticationFacadeImpl authenticationFacadeImpl;

  private final UserRepository userRepository;

  public AuthUtils(AuthenticationFacadeImpl authenticationFacadeImpl, UserRepository userRepository){
    this.authenticationFacadeImpl = authenticationFacadeImpl;
    this.userRepository = userRepository;
  }

  public User getCurrentlyAuthenticatedUser() throws RuntimeException{
    Authentication authentication = authenticationFacadeImpl.getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    Optional<User> optionalUser = userRepository.findById(userDetails.getId());

    if (!optionalUser.isPresent()) {
      throw new RuntimeException("somehow user doesnt exist");
    }
    User userInstance = optionalUser.get();
    return userInstance;
  }
}
