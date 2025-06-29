package com.controller;

import com.dto.response.ApiResponse;
import com.dto.response.ErrorResponse;
import com.dto.response.UserResponse;
import com.dto.response.PublicKeyResponse;
import com.dto.response.PublicKeyMetadata;
import com.service.UserService;
import com.util.SecurityUtils;
import com.model.User;
import com.model.PublicKey;
import com.service.PublicKeyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
            LocalDateTime now = LocalDateTime.now();
            List<PublicKey> publicKeys = publicKeyService.findByUser(user);
            PublicKeyMetadata metadata = publicKeyService.getPublicKeyMetadata(user, now);
            return ResponseEntity.ok(PublicKeyResponse.getSuccess(publicKeys, metadata));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }

    @GetMapping("/me/public-keys/active")
    public ResponseEntity<ApiResponse> getActivePublicKey(@RequestParam(required = false) String keyAlias) {
        try {
            User user = SecurityUtils.getCurrentUser();
            List<PublicKey> publicKeys;
            
            if (keyAlias != null && !keyAlias.trim().isEmpty()) {
                publicKeys = publicKeyService.searchActiveKeysByAlias(user, keyAlias);
            } else {
                publicKeys = publicKeyService.findActiveKeysWithLimit(user, 10);
            }
            
            return ResponseEntity.ok(PublicKeyResponse.searchSuccess(publicKeys));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }
}