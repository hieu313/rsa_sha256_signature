package com.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ErrorResponse extends ApiResponse {
    private int code;
    private String error;

    private ErrorResponse(boolean success, int code, String error, String message) {
        super(success, message);
        this.code = code;
        this.error = error;
    }

    public static ErrorResponse of(String message, HttpStatus status) {
        return new ErrorResponse(
            false,
            status.value(),
            status.getReasonPhrase(),
            message
        );
    }

    public static ErrorResponse badRequest(String message) {
        return of(message, HttpStatus.BAD_REQUEST);
    }

    public static ErrorResponse unauthorized(String message) {
        return of(message, HttpStatus.UNAUTHORIZED);
    }

    public static ErrorResponse forbidden(String message) {
        return of(message, HttpStatus.FORBIDDEN);
    }

    public static ErrorResponse notFound(String message) {
        return of(message, HttpStatus.NOT_FOUND);
    }

    public static ErrorResponse internalError(String message) {
        return of(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
} 