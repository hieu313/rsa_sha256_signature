package com.controller;

import com.dto.response.ApiResponse;
import com.dto.response.UserResponse;
import com.service.UserService;
import com.util.SecurityUtils;
import com.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> me() {
        User user = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(UserResponse.meSuccess(user));
    }
}