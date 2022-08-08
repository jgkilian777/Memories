package com.jgkilian777.memories;


import com.jgkilian777.memories.security.AuthEntryPointJwt;
import com.jgkilian777.memories.security.AuthTokenFilter;
import com.jgkilian777.memories.user.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {


//  private UserDetailsServiceImpl userDetailsService;

//  @Autowired
//  public void setUserDetailsService(UserDetailsServiceImpl userDetailsService) {
//    this.userDetailsService = userDetailsService;
//  }

  private AuthEntryPointJwt unauthorizedHandler;

  @Autowired
  public void setUnauthorizedHandler(AuthEntryPointJwt unauthorizedHandler) {
    this.unauthorizedHandler = unauthorizedHandler;
  }

//  @Bean
//  public CommonsRequestLoggingFilter logFilter() {
//    CommonsRequestLoggingFilter filter
//      = new CommonsRequestLoggingFilter();
//    filter.setIncludeQueryString(true);
//    filter.setIncludePayload(true);
//    filter.setMaxPayloadLength(10000);
//    filter.setIncludeHeaders(false);
//    filter.setAfterMessagePrefix("REQUEST DATA : ");
//    return filter;
//  }

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
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
                      .antMatchers("/api/test/**").permitAll()
                      .antMatchers("/api/memories/**").permitAll()
                      .anyRequest().authenticated()
              )

              .httpBasic(withDefaults())
//                .formLogin(formLogin ->
//                        formLogin
//                            .loginPage("/login")
//                            .permitAll()
//                )
              .logout(logout ->
                logout.permitAll()
               );
    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
//    http.addFilterBefore(logFilter(), UsernamePasswordAuthenticationFilter.class);
//              .csrf(csrf ->
//                csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//              );
      return http.build();
  }




//
//    @Bean
//    @Override
//    public UserDetailsService userDetailsService() {
//        UserDetails user =
//                User.withDefaultPasswordEncoder()
//                        .username("user")
//                        .password("password")
//                        .roles("USER")
//                        .build();
//
//        return new InMemoryUserDetailsManager(user);
//    }
}
