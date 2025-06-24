package com.service;

import com.model.Document;
import com.model.DocumentSignature;
import com.model.User;
import com.model.PublicKey;
import com.repository.DocumentSignatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class DocumentSignatureService {
    private final DocumentSignatureRepository documentSignatureRepository;

    @Autowired
    public DocumentSignatureService(DocumentSignatureRepository documentSignatureRepository) {
        this.documentSignatureRepository = documentSignatureRepository;
    }

    public DocumentSignature createSignature(Document document, User signer, PublicKey signingKey, 
                                          byte[] documentHash, String signatureValue, 
                                          boolean isValid, String validationDetails) {
        // Kiểm tra xem người dùng đã ký tài liệu này chưa
        if (documentSignatureRepository.existsByDocumentAndSignerAndIsValidTrue(document, signer)) {
            throw new IllegalStateException("Người dùng đã ký tài liệu này trước đó");
        }

        DocumentSignature signature = new DocumentSignature();
        signature.setDocument(document);
        signature.setSigner(signer);
        signature.setSigningKey(signingKey);
        signature.setDocumentHash(documentHash);
        signature.setSignatureValue(signatureValue);
        signature.setValid(isValid);
        signature.setValidationDetails(validationDetails);

        return documentSignatureRepository.save(signature);
    }

    public Optional<DocumentSignature> findById(UUID id) {
        return documentSignatureRepository.findById(id);
    }

    public List<DocumentSignature> findByDocument(Document document) {
        return documentSignatureRepository.findByDocument(document);
    }

    public List<DocumentSignature> findValidSignatures(Document document) {
        return documentSignatureRepository.findByDocumentAndIsValidTrue(document);
    }

    public Page<DocumentSignature> findByUser(User signer, Pageable pageable) {
        return documentSignatureRepository.findBySigner(signer, pageable);
    }

    public List<DocumentSignature> findBySigningKey(PublicKey signingKey) {
        return documentSignatureRepository.findBySigningKey(signingKey);
    }

    public List<DocumentSignature> findValidSignaturesInTimeRange(Document document, 
                                                                LocalDateTime startTime, 
                                                                LocalDateTime endTime) {
        return documentSignatureRepository.findValidSignaturesInTimeRange(document, startTime, endTime);
    }

    public void deleteSignature(DocumentSignature signature) {
        documentSignatureRepository.delete(signature);
    }

    public DocumentSignature updateValidationStatus(DocumentSignature signature, 
                                                 boolean isValid, 
                                                 String validationDetails) {
        signature.setValid(isValid);
        signature.setValidationDetails(validationDetails);
        return documentSignatureRepository.save(signature);
    }

    public DocumentSignature createPendingSignature(Document document, User signer) {
        DocumentSignature signature = new DocumentSignature();
        signature.setDocument(document);
        signature.setSigner(signer);
        signature.setStatus(DocumentSignature.DocumentSignatureStatus.pending);
        signature.setValid(false);
        signature.setDocumentHash(document.getOriginalHash());

        return documentSignatureRepository.save(signature);
    }

    public DocumentSignature getSignatureById(UUID id) {
        return documentSignatureRepository.findById(id)
            .orElse(null);
    }

    public DocumentSignature saveSignature(DocumentSignature signature) {
        return documentSignatureRepository.save(signature);
    }
} 