package com.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.model.PublicKey;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublicKeyResponse {
    private PublicKey publicKey;

    public PublicKeyResponse(PublicKey publicKey) {
        this.publicKey = publicKey;
    }

    public static SuccessResponse<PublicKeyResponse> uploadSuccess(PublicKey publicKey) {
        return SuccessResponse.of("Upload public key success", new PublicKeyResponse(publicKey));
    }

    public static SuccessResponse<PublicKeyResponse> getSuccess(List<PublicKey> publicKeys) {
        return SuccessResponse.of("Get public keys success", (PublicKeyResponse) publicKeys.stream()
                .map(PublicKeyResponse::new)
                .collect(Collectors.toList()));
    }

    public static SuccessResponse<PublicKeyResponse> revokeSuccess(PublicKey publicKey) {
        return SuccessResponse.of("Revoke public key success", new PublicKeyResponse(publicKey));
    }
}