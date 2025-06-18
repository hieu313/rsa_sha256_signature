package com.service;

import com.dto.request.auth.LoginRequest;
import com.dto.request.auth.RegisterRequest;
import com.model.User;
import com.repository.UserRepository;
import com.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.security.CustomUserDetailsService;

@Service
public class AuthService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AuthenticationManager authManager;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private CustomUserDetailsService userDetailsService;

  @Autowired
  private UserService userService;

  public String register(RegisterRequest request) {
    User newUser = userService.createUser(request.getName(), request.getEmail(), request.getPassword());

    return jwtUtil.generateToken(newUser.getEmail());
  }

  public String login(LoginRequest request) {
    authManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );

    UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
    return jwtUtil.generateToken(userDetails.getUsername());
  }
}
