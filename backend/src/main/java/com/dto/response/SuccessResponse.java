package com.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SuccessResponse<T> extends ApiResponse {
    private T data;

    private SuccessResponse(String message, T data) {
        super(true, message);
        this.data = data;
    }

    public static <T> SuccessResponse<T> of(String message, T data) {
        return new SuccessResponse<>(message, data);
    }

    public static <T> SuccessResponse<T> of(T data) {
        return new SuccessResponse<>("Thành công", data);
    }
} 