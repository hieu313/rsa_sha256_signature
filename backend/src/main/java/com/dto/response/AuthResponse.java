package com.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse extends ApiResponse {
    private String token;

    public AuthResponse(boolean success, String message, String token) {
        super(success, message);
        this.token = token;
    }

    public static AuthResponse loginSuccess(String token) {
        return new AuthResponse(true, "Đăng nhập thành công", token);
    }

    public static AuthResponse registerSuccess(String token) {
        return new AuthResponse(true, "Đăng ký thành công", token);
    }

    public static AuthResponse logoutSuccess() {
        return new AuthResponse(true, "Đăng xuất thành công", null);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null);
    }
}