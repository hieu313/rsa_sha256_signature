package com.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.model.PublicKey;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
public class PublicKeyResponse {
    private UUID id;
    private String keyAlias;
    private String publicKeyPem;
    private String fingerprint;
    private int keySize;
    private int keyUsage;
    private LocalDateTime revokedAt;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean isDefault;
    private boolean revoked;

    public PublicKeyResponse(PublicKey publicKey) {
        this.id = publicKey.getId();
        this.keyAlias = publicKey.getKeyAlias();
        this.publicKeyPem = publicKey.getPublicKeyPem();
        this.fingerprint = publicKey.getFingerprint();
        this.keySize = publicKey.getKeySize();
        this.keyUsage = publicKey.getKeyUsage();
        this.revokedAt = publicKey.getRevokedAt();
        this.createdAt = publicKey.getCreatedAt();
        this.expiresAt = publicKey.getExpiresAt();
        this.isDefault = publicKey.isDefault();
        this.revoked = publicKey.isRevoked();
    }

    public static SuccessResponse<PublicKeyResponse> uploadSuccess(PublicKey publicKey) {
        return SuccessResponse.of("Upload public key success", new PublicKeyResponse(publicKey));
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class PublicKeyListResponse {
        private List<PublicKeyResponse> keys;
        private PublicKeyMetadata meta;
    }

    public static SuccessResponse<PublicKeyListResponse> getSuccess(List<PublicKey> publicKeys, PublicKeyMetadata metadata) {
        List<PublicKeyResponse> responses = publicKeys.stream()
                .map(PublicKeyResponse::new)
                .collect(Collectors.toList());
        return SuccessResponse.of("Get public keys success", new PublicKeyListResponse(responses, metadata));
    }

    public static SuccessResponse<PublicKeyResponse> revokeSuccess(PublicKey publicKey) {
        return SuccessResponse.of("Revoke public key success", new PublicKeyResponse(publicKey));
    }

    public static SuccessResponse<List<PublicKeyResponse>> searchSuccess(List<PublicKey> publicKeys) {
        List<PublicKeyResponse> responses = publicKeys.stream()
                .map(PublicKeyResponse::new)
                .collect(Collectors.toList());
        return SuccessResponse.of("Search public keys success", responses);
    }
}