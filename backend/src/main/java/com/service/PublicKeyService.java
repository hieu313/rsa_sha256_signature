package com.service;

import com.model.PublicKey;
import com.model.User;
import com.repository.PublicKeyRepository;
import com.util.KeyUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
    public PublicKey addPublicKey(User user, String publicKeyPem, String keyAlias, LocalDateTime expiresAt) {
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
} 