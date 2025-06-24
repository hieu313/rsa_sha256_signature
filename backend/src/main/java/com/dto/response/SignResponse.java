package com.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignResponse {
    private UUID signatureId;

    public static SuccessResponse<SignResponse> of(UUID signatureId) {
        return SuccessResponse.of("Xác thực chữ ký thành công", new SignResponse(signatureId));
    }
}