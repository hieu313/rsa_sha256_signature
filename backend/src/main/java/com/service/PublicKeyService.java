package com.service;

import com.model.PublicKey;
import com.model.User;
import com.repository.PublicKeyRepository;
import com.util.KeyUtils;
import com.dto.response.PublicKeyMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PublicKeyService {
  private final PublicKeyRepository publicKeyRepository;

  @Autowired
  public PublicKeyService(PublicKeyRepository publicKeyRepository) {
    this.publicKeyRepository = publicKeyRepository;
  }

  @Transactional
  public PublicKey addPublicKey(User user, String publicKeyPem, String keyAlias, LocalDateTime expiresAt, int keySize) {
    String fingerprint = KeyUtils.calculateFingerprint(publicKeyPem);
    // Kiểm tra fingerprint đã tồn tại chưa
    if (publicKeyRepository.existsByFingerprint(fingerprint)) {
      throw new IllegalArgumentException("Public key này đã được đăng ký trước đó");
    }

    // Nếu user đã có default key, set key đó thành non-default
    Optional<PublicKey> existingDefaultKey = publicKeyRepository.findByUserAndIsDefaultTrue(user);
    existingDefaultKey.ifPresent(key -> {
      key.setDefault(false);
      publicKeyRepository.save(key);
    });

    // Tạo public key mới
    PublicKey publicKey = new PublicKey();
    publicKey.setUser(user);
    publicKey.setPublicKeyPem(publicKeyPem);
    publicKey.setFingerprint(fingerprint);
    publicKey.setKeyAlias(keyAlias);
    publicKey.setExpiresAt(expiresAt);
    publicKey.setKeySize(keySize);
    publicKey.setDefault(true); // Set key mới là default

    return publicKeyRepository.save(publicKey);
  }

  public Optional<PublicKey> findById(UUID id) {
    return publicKeyRepository.findById(id);
  }

  public List<PublicKey> findByUser(User user) {
    return publicKeyRepository.findByUser(user);
  }

  public Optional<PublicKey> findDefaultKey(User user) {
    return publicKeyRepository.findByUserAndIsDefaultTrue(user);
  }

  public List<PublicKey> findValidKeys(User user, LocalDateTime now) {
    return publicKeyRepository.findValidKeys(user, now);
  }

  @Transactional
  public PublicKey revokeKey(PublicKey publicKey, LocalDateTime revokedAt) {
    publicKey.setRevoked(true);
    publicKey.setRevokedAt(revokedAt);
    return publicKeyRepository.save(publicKey);
  }

  public Optional<PublicKey> findByFingerprint(String fingerprint) {
    return publicKeyRepository.findByFingerprint(fingerprint);
  }

  public PublicKeyMetadata getPublicKeyMetadata(User user, LocalDateTime now) {
    return PublicKeyMetadata.builder()
        .total(publicKeyRepository.countByUser(user))
        .active(publicKeyRepository.countActiveKeysByUser(user, now))
        .revoked(publicKeyRepository.countRevokedKeysByUser(user))
        .expired(publicKeyRepository.countExpiredKeysByUser(user, now))
        .build();
  }

  public List<PublicKey> searchActiveKeysByAlias(User user, String keyAlias) {
    return publicKeyRepository.searchActiveKeysByAlias(user, LocalDateTime.now(), keyAlias);
  }

  public List<PublicKey> findActiveKeysWithLimit(User user, int limit) {
    return publicKeyRepository.findActiveKeysWithLimit(user, LocalDateTime.now(), PageRequest.of(0, limit));
  }

  public PublicKey getPublicKeyById(UUID id) {
    return publicKeyRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy public key"));
  }

  @Transactional
  public PublicKey updatePublicKey(PublicKey publicKey, String keyAlias, LocalDateTime expiresAt, boolean isDefault) {
    // Cập nhật thông tin cơ bản
    publicKey.setKeyAlias(keyAlias);
    publicKey.setExpiresAt(expiresAt);

    // Xử lý defaultKey
    if (isDefault) {
      if (!publicKey.isDefault()) {
        // Nếu key này được set làm default, hủy default của key khác
        Optional<PublicKey> existingDefaultKey = publicKeyRepository.findByUserAndIsDefaultTrue(publicKey.getUser());
        existingDefaultKey.ifPresent(key -> {
          if (!key.getId().equals(publicKey.getId())) {
            key.setDefault(false);
            publicKeyRepository.save(key);
          }
        });
        publicKey.setDefault(true);
      }
      // Nếu key đã là default thì giữ nguyên
    } else {
      // Nếu muốn hủy default
      if (publicKey.isDefault()) {
        // Kiểm tra xem có key hợp lệ khác không
        if (publicKeyRepository.countValidNonRevokedKeys(publicKey.getUser(), LocalDateTime.now()) > 1) {
          publicKey.setDefault(false);
        } else {
          throw new IllegalArgumentException("Không thể hủy default key khi chỉ có một key hợp lệ");
        }
      }
    }

    return publicKeyRepository.save(publicKey);
  }
} 