package com.dto.request.key;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicKeyUploadRequest {
    private String publicKeyPem;
    private String keyAlias;
    private LocalDateTime expiresAt;
    private int keySize;
}