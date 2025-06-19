package com.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_signatures")
@Getter
@Setter
@NoArgsConstructor
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
    private PublicKey signingKey;

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
} 