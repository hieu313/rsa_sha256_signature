package com.controller;

import com.dto.request.key.PublicKeyUpdateRequest;
import com.dto.request.key.PublicKeyUploadRequest;
import com.dto.response.PublicKeyResponse;
import com.dto.response.ApiResponse;
import com.dto.response.ErrorResponse;
import com.model.PublicKey;
import com.model.User;
import com.service.PublicKeyService;
import com.service.UserService;
import com.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public-keys")
public class PublicKeyController {
  private final PublicKeyService publicKeyService;
  private final UserService userService;

  @Autowired
  public PublicKeyController(PublicKeyService publicKeyService, UserService userService) {
    this.publicKeyService = publicKeyService;
    this.userService = userService;
  }

  @PostMapping()
  public ResponseEntity<ApiResponse> uploadPublicKey(
      @RequestBody PublicKeyUploadRequest request) {
    try {
      User user = SecurityUtils.getCurrentUser();
      PublicKey publicKey = publicKeyService.addPublicKey(
          user,
          request.getPublicKeyPem(),
          request.getKeyAlias(),
          request.getExpiresAt(),
          request.getKeySize()
      );

      return ResponseEntity.ok(PublicKeyResponse.uploadSuccess(publicKey));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(ErrorResponse.badRequest(e.getMessage()));
    }
  }

  @PatchMapping("/{keyId}")
  public ResponseEntity<ApiResponse> updatePublicKey(
      @PathVariable UUID keyId,
      @RequestBody PublicKeyUpdateRequest request) {
    try {
      User user = SecurityUtils.getCurrentUser();
      PublicKey publicKey = publicKeyService.findById(keyId)
          .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy public key"));

      if (!publicKey.getUser().getId().equals(user.getId())) {
        return ResponseEntity.badRequest()
            .body(ErrorResponse.badRequest("Không có quyền cập nhật public key này"));
      }

      PublicKey updatedKey = publicKeyService.updatePublicKey(
          publicKey,
          request.getKeyAlias(),
          request.getExpiresAt(),
          request.isDefault()
      );
      return ResponseEntity.ok(PublicKeyResponse.updateSuccess(updatedKey));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(ErrorResponse.badRequest(e.getMessage()));
    }
  }

  @DeleteMapping("/{keyId}")
  public ResponseEntity<ApiResponse> revokePublicKey(
      @PathVariable UUID keyId) {
    try {
      User user = SecurityUtils.getCurrentUser();

      PublicKey publicKey = publicKeyService.findById(keyId)
          .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy public key"));

      if (!publicKey.getUser().getId().equals(user.getId())) {
        return ResponseEntity.badRequest()
            .body(ErrorResponse.badRequest("Không có quyền thu hồi public key này"));
      }

      PublicKey revokedKey = publicKeyService.revokeKey(publicKey, LocalDateTime.now());
      return ResponseEntity.ok(PublicKeyResponse.revokeSuccess(revokedKey));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(ErrorResponse.badRequest(e.getMessage()));
    }
  }
}
