package com.controller;

import com.dto.request.auth.LoginRequest;
import com.dto.request.auth.RegisterRequest;
import com.dto.response.ApiResponse;
import com.dto.response.AuthResponse;
import com.dto.response.ErrorResponse;
import com.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        try {   
            String token = authService.register(request);
            return ResponseEntity.ok(AuthResponse.registerSuccess(token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            return ResponseEntity.ok(AuthResponse.loginSuccess(token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest()
                .body(ErrorResponse.badRequest(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        // TODO: Thêm logic vô hiệu hóa token nếu cần
        return ResponseEntity.ok(AuthResponse.logoutSuccess());
    }
}