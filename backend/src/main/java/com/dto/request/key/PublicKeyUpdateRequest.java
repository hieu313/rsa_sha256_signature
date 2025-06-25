package com.dto.request.key;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicKeyUpdateRequest {
  private String keyAlias;
  private boolean isDefault;
  private LocalDateTime expiresAt;
}