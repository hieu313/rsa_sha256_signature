package com.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VerifySignatureRequest {
    private String signValue;
    private String signTimestamp;
    private String hashValue;
    private UUID sessionId;
    private UUID publicKeyId;
} 