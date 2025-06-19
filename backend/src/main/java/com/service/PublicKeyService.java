package com.service;

import com.model.PublicKey;
import com.model.User;
import com.repository.PublicKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PublicKeyService {
    private final PublicKeyRepository publicKeyRepository;

    @Autowired
    public PublicKeyService(PublicKeyRepository publicKeyRepository) {
        this.publicKeyRepository = publicKeyRepository;
    }

    public PublicKey addPublicKey(User user, String publicKeyPem, String fingerprint, String keyAlias, LocalDateTime expiresAt) {
        if (publicKeyRepository.existsByFingerprint(fingerprint)) {
            throw new IllegalArgumentException("Khóa công khai với fingerprint này đã tồn tại");
        }

        PublicKey publicKey = new PublicKey();
        publicKey.setUser(user);
        publicKey.setPublicKeyPem(publicKeyPem);
        publicKey.setFingerprint(fingerprint);
        publicKey.setKeyAlias(keyAlias);
        publicKey.setExpiresAt(expiresAt);

        // Nếu đây là khóa đầu tiên của user, đặt làm mặc định
        if (!publicKeyRepository.existsByUserAndIsDefaultTrue(user)) {
            publicKey.setDefault(true);
        }

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

    public List<PublicKey> findValidKeys(User user) {
        return publicKeyRepository.findValidKeys(user, LocalDateTime.now());
    }

    public PublicKey setAsDefault(PublicKey publicKey) {
        User user = publicKey.getUser();
        
        // Hủy trạng thái mặc định của khóa cũ
        publicKeyRepository.findByUserAndIsDefaultTrue(user)
            .ifPresent(oldDefault -> {
                oldDefault.setDefault(false);
                publicKeyRepository.save(oldDefault);
            });

        // Đặt khóa mới làm mặc định
        publicKey.setDefault(true);
        return publicKeyRepository.save(publicKey);
    }

    public PublicKey revokeKey(PublicKey publicKey, LocalDateTime revokedAt) {
        if (publicKey.isRevoked()) {
            throw new IllegalStateException("Khóa đã bị thu hồi trước đó");
        }

        publicKey.setRevoked(true);
        publicKey.setRevokedAt(revokedAt);

        // Nếu đây là khóa mặc định, hủy trạng thái mặc định
        if (publicKey.isDefault()) {
            publicKey.setDefault(false);
        }

        return publicKeyRepository.save(publicKey);
    }

    public Optional<PublicKey> findByFingerprint(String fingerprint) {
        return publicKeyRepository.findByFingerprint(fingerprint);
    }
} 