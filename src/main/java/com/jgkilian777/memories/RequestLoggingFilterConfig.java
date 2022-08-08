package com.jgkilian777.memories;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.AbstractRequestLoggingFilter;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import javax.servlet.http.HttpServletRequest;

//@Configuration
//public class RequestLoggingFilterConfig extends AbstractRequestLoggingFilter {
//
//  @Override
//  protected void beforeRequest(HttpServletRequest request, String message) {
//    System.out.print(message);
//  }
//
//  @Override
//  protected void afterRequest(HttpServletRequest request, String message) {
//    System.out.print(message);
//  }
//
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
//}
