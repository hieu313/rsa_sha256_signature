package com.controller;

import com.dto.response.ApiResponse;
import com.dto.response.ErrorResponse;
import com.dto.response.UserResponse;
import com.dto.response.PublicKeyResponse;
import com.service.UserService;
import com.util.SecurityUtils;
import com.model.User;
import com.model.PublicKey;
import com.service.PublicKeyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PublicKeyService publicKeyService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> me() {
        User user = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(UserResponse.meSuccess(user));
    }

    @GetMapping("/me/public-keys")
    public ResponseEntity<ApiResponse> getPublicKeys() {
        try {
            User user = SecurityUtils.getCurrentUser();
            List<PublicKey> publicKeys = publicKeyService.findByUser(user);
            return ResponseEntity.ok(PublicKeyResponse.getSuccess(publicKeys));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }
}