package com.repository;

import com.model.Document;
import com.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    Page<Document> findByUser(User user, Pageable pageable);
    Page<Document> findByUserAndStatus(User user, String status, Pageable pageable);
    Optional<Document> findByOriginalHash(byte[] originalHash);
    boolean existsByOriginalHash(byte[] originalHash);
} 