package com.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "document_signatures")
public class DocumentSignature {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signer_id", nullable = false)
    private User signer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signing_key_id", nullable = false)
    private UserPublicKey signingKey;

    @Column(name = "document_hash", nullable = false)
    private byte[] documentHash;

    @Column(name = "signature_value", nullable = false, columnDefinition = "text")
    private String signatureValue;

    @Column(name = "signature_timestamp", nullable = false, updatable = false)
    private LocalDateTime signatureTimestamp;

    @Column(name = "is_valid", nullable = false)
    private boolean isValid;

    @Column(name = "validation_details")
    @JdbcTypeCode(SqlTypes.JSON)
    private String validationDetails;

    @PrePersist
    protected void onCreate() {
        signatureTimestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public User getSigner() {
        return signer;
    }

    public void setSigner(User signer) {
        this.signer = signer;
    }

    public UserPublicKey getSigningKey() {
        return signingKey;
    }

    public void setSigningKey(UserPublicKey signingKey) {
        this.signingKey = signingKey;
    }

    public byte[] getDocumentHash() {
        return documentHash;
    }

    public void setDocumentHash(byte[] documentHash) {
        this.documentHash = documentHash;
    }

    public String getSignatureValue() {
        return signatureValue;
    }

    public void setSignatureValue(String signatureValue) {
        this.signatureValue = signatureValue;
    }

    public LocalDateTime getSignatureTimestamp() {
        return signatureTimestamp;
    }

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean valid) {
        isValid = valid;
    }

    public String getValidationDetails() {
        return validationDetails;
    }

    public void setValidationDetails(String validationDetails) {
        this.validationDetails = validationDetails;
    }
} 