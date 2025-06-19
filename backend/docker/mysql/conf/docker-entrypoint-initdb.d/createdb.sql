CREATE DATABASE IF NOT EXISTS `rsa_system` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'default'@'%' IDENTIFIED BY 'default';
GRANT ALL PRIVILEGES ON `rsa_system`.* TO 'default'@'%';
FLUSH PRIVILEGES;

USE rsa_system;

-- Bảng users
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Bảng public_keys
CREATE TABLE public_keys (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    key_alias VARCHAR(255),
    public_key_pem TEXT NOT NULL,
    fingerprint VARCHAR(255) NOT NULL UNIQUE,
    key_size INT NOT NULL,
    key_usage INT NOT NULL DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_fingerprint (fingerprint),
    INDEX idx_revoked_expires (is_revoked, expires_at),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng documents
CREATE TABLE documents (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT,
    original_hash BINARY(32) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    INDEX idx_user_status (user_id, status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng document_signatures
CREATE TABLE document_signatures (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    document_id BINARY(16) NOT NULL,
    signer_id BINARY(16) NOT NULL,
    signing_key_id BINARY(16) NOT NULL,
    document_hash BINARY(32) NOT NULL,
    signature_value TEXT NOT NULL,
    signature_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_valid BOOLEAN NOT NULL,
    validation_details JSON,
    INDEX idx_document_id (document_id),
    INDEX idx_document_valid (document_id, is_valid),
    INDEX idx_signer_id (signer_id),
    INDEX idx_signing_key_id (signing_key_id),
    INDEX idx_signature_timestamp (signature_timestamp),
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (signer_id) REFERENCES users(id),
    FOREIGN KEY (signing_key_id) REFERENCES public_keys(id)
);