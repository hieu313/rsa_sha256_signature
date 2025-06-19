package com.repository;

import com.model.Document;
import com.model.DocumentSignature;
import com.model.User;
import com.model.PublicKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface DocumentSignatureRepository extends JpaRepository<DocumentSignature, UUID> {
    List<DocumentSignature> findByDocument(Document document);
    List<DocumentSignature> findByDocumentAndIsValidTrue(Document document);
    Page<DocumentSignature> findBySigner(User signer, Pageable pageable);
    List<DocumentSignature> findBySigningKey(PublicKey signingKey);
    
    @Query("SELECT ds FROM DocumentSignature ds WHERE ds.document = ?1 AND ds.isValid = true AND ds.signatureTimestamp BETWEEN ?2 AND ?3")
    List<DocumentSignature> findValidSignaturesInTimeRange(Document document, LocalDateTime startTime, LocalDateTime endTime);
    
    boolean existsByDocumentAndSignerAndIsValidTrue(Document document, User signer);
} 