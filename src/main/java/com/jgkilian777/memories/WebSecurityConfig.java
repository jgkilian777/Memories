package com.jgkilian777.memories;


import com.jgkilian777.memories.security.AuthEntryPointJwt;
import com.jgkilian777.memories.security.AuthTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {


  private final AuthEntryPointJwt unauthorizedHandler;

  private final AuthTokenFilter authenticationJwtTokenFilter;

  public WebSecurityConfig(AuthEntryPointJwt unauthorizedHandler, AuthTokenFilter authenticationJwtTokenFilter){
    this.unauthorizedHandler=unauthorizedHandler;
    this.authenticationJwtTokenFilter=authenticationJwtTokenFilter;
  }


  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      http
        .cors().and().csrf().disable()
        .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()

        .authorizeRequests(authorizeRequests ->
                  authorizeRequests
                      .antMatchers("/api/auth/**").permitAll()
                      .anyRequest().authenticated()
              )

              .httpBasic(withDefaults())
              .logout(logout ->
                logout.permitAll()
               );
    http.addFilterBefore(authenticationJwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
      return http.build();
  }
}
