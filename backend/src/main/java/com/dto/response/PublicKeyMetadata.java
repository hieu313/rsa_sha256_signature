package com.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicKeyMetadata {
    private int total;
    private int active;
    private int revoked;
    private int expired;
} 