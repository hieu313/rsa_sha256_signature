package com.repository;

import com.model.PublicKey;
import com.model.User;
import com.dto.response.PublicKeyMetadata;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT COUNT(pk) FROM PublicKey pk WHERE pk.user = ?1")
    int countByUser(User user);

    @Query("SELECT COUNT(pk) FROM PublicKey pk WHERE pk.user = ?1 AND pk.isRevoked = true")
    int countRevokedKeysByUser(User user);

    @Query("SELECT COUNT(pk) FROM PublicKey pk WHERE pk.user = ?1 AND pk.isRevoked = false AND pk.expiresAt < ?2")
    int countExpiredKeysByUser(User user, LocalDateTime now);

    @Query("SELECT COUNT(pk) FROM PublicKey pk WHERE pk.user = ?1 AND pk.isRevoked = false AND (pk.expiresAt IS NULL OR pk.expiresAt >= ?2)")
    int countActiveKeysByUser(User user, LocalDateTime now);

    @Query("SELECT pk FROM PublicKey pk WHERE pk.user = ?1 AND pk.isRevoked = false " +
           "AND (pk.expiresAt IS NULL OR pk.expiresAt > ?2) " +
           "AND LOWER(pk.keyAlias) LIKE LOWER(CONCAT('%', ?3, '%'))")
    List<PublicKey> searchActiveKeysByAlias(User user, LocalDateTime now, String keyAlias);

    @Query("SELECT pk FROM PublicKey pk WHERE pk.user = ?1 AND pk.isRevoked = false " +
           "AND (pk.expiresAt IS NULL OR pk.expiresAt > ?2)")
    List<PublicKey> findActiveKeysWithLimit(User user, LocalDateTime now, Pageable pageable);

    @Query("SELECT COUNT(pk) FROM PublicKey pk WHERE pk.user = :user AND pk.isRevoked = false AND (pk.expiresAt IS NULL OR pk.expiresAt > :now)")
    long countValidNonRevokedKeys(@Param("user") User user, @Param("now") LocalDateTime now);
} 