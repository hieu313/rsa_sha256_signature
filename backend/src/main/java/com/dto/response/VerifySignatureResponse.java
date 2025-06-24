package com.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifySignatureResponse {
    private boolean valid;

    public static SuccessResponse<VerifySignatureResponse> validSignature() {
        return SuccessResponse.of("Chữ ký hợp lệ", new VerifySignatureResponse(true));
    }

    public static SuccessResponse<VerifySignatureResponse> invalidSignature() {
        return SuccessResponse.of("Chữ ký không hợp lệ", new VerifySignatureResponse(false));
    }
} 