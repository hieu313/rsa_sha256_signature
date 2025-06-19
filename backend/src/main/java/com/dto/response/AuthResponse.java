package com.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;

    public static SuccessResponse<AuthResponse> loginSuccess(String token) {
        return SuccessResponse.of("Đăng nhập thành công", new AuthResponse(token));
    }

    public static SuccessResponse<AuthResponse> registerSuccess(String token) {
        return SuccessResponse.of("Đăng ký thành công", new AuthResponse(token));
    }

    public static SuccessResponse<Void> logoutSuccess() {
        return SuccessResponse.of("Đăng xuất thành công", null);
    }
}