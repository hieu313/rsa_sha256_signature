package com.repository;

import com.model.PublicKey;
import com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface PublicKeyRepository extends JpaRepository<PublicKey, UUID> {
    List<PublicKey> findByUser(User user);
    Optional<PublicKey> findByUserAndIsDefaultTrue(User user);
    Optional<PublicKey> findByFingerprint(String fingerprint);
    List<PublicKey> findByUserAndIsRevokedFalseAndExpiresAtAfter(User user, LocalDateTime now);
    
    @Query("SELECT pk FROM PublicKey pk WHERE pk.user = ?1 AND pk.isRevoked = false AND (pk.expiresAt IS NULL OR pk.expiresAt > ?2)")
    List<PublicKey> findValidKeys(User user, LocalDateTime now);
    
    boolean existsByUserAndIsDefaultTrue(User user);
    boolean existsByFingerprint(String fingerprint);
} 